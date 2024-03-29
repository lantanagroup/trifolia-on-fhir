import { Component, DoCheck, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import {
  Coding,
  Extension,
  ImplementationGuide,
  PackageComponent,
  PackageResourceComponent,
  PageComponent
} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ImplementationGuideService, PublishedGuideModel } from '../../shared/implementation-guide.service';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageComponentModalComponent } from './page-component-modal.component';
import { FhirService } from '../../shared/fhir.service';
import { FileService } from '../../shared/file.service';
import { ConfigService } from '../../shared/config.service';
import { PublishedIgSelectModalComponent } from '../../modals/published-ig-select-modal/published-ig-select-modal.component';
import { ValidatorResponse } from 'fhir/validator';
import { FhirReferenceModalComponent, ResourceSelection } from '../../fhir-edit/reference-modal/reference-modal.component';
import { ClientHelper } from '../../clientHelper';
import { getErrorString, parseReference } from '../../../../../../libs/tof-lib/src/lib/helper';
import { STU3ResourceModalComponent } from './resource-modal.component';
import { ChangeResourceIdModalComponent } from '../../modals/change-resource-id-modal/change-resource-id-modal.component';
import { BaseImplementationGuideComponent } from '../base-implementation-guide-component';
import { CanComponentDeactivate } from '../../guards/resource.guard';
import { ProjectService } from '../../shared/projects.service';
import {IFhirResource, IgnoreWarnings, IProjectResourceReference, IProjectResourceReferenceMap, Page, PublicationRequest} from '@trifolia-fhir/models';
import {firstValueFrom, forkJoin} from 'rxjs';
import { IDomainResource, getImplementationGuideContext } from '@trifolia-fhir/tof-lib';
import {NonFhirResourceService} from '../../shared/non-fhir-resource.service';


class Parameter {
  public extension: Extension;

  constructor(extension: Extension) {
    this.extension = extension;
  }

  get code(): string {
    const ext = (this.extension.extension || []).find(e => e.url === 'code');
    return ext ? ext.valueString : '';
  }

  set code(value: string) {
    this.extension.extension = this.extension.extension || [];
    let ext = this.extension.extension.find(e => e.url === 'code');

    if (!ext && value) {
      ext = new Extension({ url: 'code', valueString: value });
      this.extension.extension.push(ext);
    } else if (ext && !value) {
      const index = this.extension.extension.indexOf(ext);
      this.extension.extension.splice(index, index >= 0 ? 1 : 0);
    } else if (ext && value) {
      ext.valueString = value;
    }
  }

  get value(): string {
    const ext = (this.extension.extension || []).find(e => e.url === 'value');
    return ext ? ext.valueString : '';
  }

  set value(value: string) {
    this.extension.extension = this.extension.extension || [];
    let ext = this.extension.extension.find(e => e.url === 'value');

    if (!ext && value) {
      ext = new Extension({ url: 'value', valueString: value });
      this.extension.extension.push(ext);
    } else if (ext && !value) {
      const index = this.extension.extension.indexOf(ext);
      this.extension.extension.splice(index, index >= 0 ? 1 : 0);
    } else if (ext && value) {
      ext.valueString = value;
    }
  }
}

class PageDefinition {
  public page: PageComponent;
  public parent?: PageComponent;
  public level: number;
  public resource: Page;
}

class ImplementationGuideResource {
  public resource: PackageResourceComponent;
  public igPackage: PackageComponent;

  constructor(resource: PackageResourceComponent, igPackage: PackageComponent) {
    this.resource = resource;
    this.igPackage = igPackage;
  }
}

@Component({
  templateUrl: './implementation-guide.component.html',
  styleUrls: ['./implementation-guide.component.css']
})
export class STU3ImplementationGuideComponent extends BaseImplementationGuideComponent implements OnInit, OnDestroy, DoCheck, CanComponentDeactivate {
  public fhirResource: IFhirResource;
  public implementationGuide;
  public message: string;
  public currentResource: any;
  public validation: ValidatorResponse;
  public pages: PageDefinition[];
  public resourceTypeCodes: Coding[] = [];
  public igNotFound = false;
  public ClientHelper = ClientHelper;
  public parameters: Parameter[] = [];
  public igChanging: EventEmitter<boolean> = new EventEmitter<boolean>();
  public implementationGuideId: string;
  private navSubscription: any;
  // noinspection JSMismatchedCollectionQueryUpdate
  private resources: ImplementationGuideResource[] = [];
  public resourceMap: IProjectResourceReferenceMap = {};
  public saving = false;
  public historyLoaded = false;
  public ignoreWarnings: IgnoreWarnings;
  public publicationRequest: PublicationRequest;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    public implementationGuideService: ImplementationGuideService,
    private fileService: FileService,
    private fhirService: FhirService,
    private nonFhirResourceService: NonFhirResourceService,
    protected authService: AuthService,
    public configService: ConfigService,
    public projectService: ProjectService) {

    super(configService, authService);

    this.implementationGuide = new ImplementationGuide({ meta: this.authService.getDefaultMeta() });

    this.igChanging.subscribe((value) => {
      this.isDirty = value;
      this.configService.setTitle(`ImplementationGuide - ${this.implementationGuide.name || 'no-name'}`, this.isDirty);
    });
  }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('implementationGuideId');
    return !id || id === 'new';
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('implementationGuideId') === 'from-file';
  }

  public isFileNameInvalid(page: PageDefinition): boolean {
    if (!page.page || !page.page.source) return false;
    const regexp: RegExp = /[^A-z0-9_\-\.]/;
    const matches = regexp.exec(page.page.source);
    return matches && matches.length > 0;
  }

  public get dependencies(): Extension[] {
    return (this.implementationGuide.extension || []).filter((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency']);
  }

  protected get packageId(): string {
    const foundExtension = (this.implementationGuide.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-package-id']);

    if (foundExtension) {
      return foundExtension.valueString;
    }
  }

  protected set packageId(value: string) {
    this.implementationGuide.extension = this.implementationGuide.extension || [];
    let foundExtension = (this.implementationGuide.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-package-id']);

    if (value) {
      if (!foundExtension) {
        foundExtension = {
          url: Globals.extensionUrls['extension-ig-package-id']
        };
        this.implementationGuide.extension.push(foundExtension);
      }

      foundExtension.valueString = value;
    } else if (!value && foundExtension) {
      const index = this.implementationGuide.extension.indexOf(foundExtension);
      this.implementationGuide.extension.splice(index, 1);
    }
  }

  public addParameter() {
    this.implementationGuide.extension = this.implementationGuide.extension || [];
    this.implementationGuide.extension.push({ url: Globals.extensionUrls['extension-ig-parameter'] });
    this.initParameters();
  }

  public removeParameter(param: Parameter) {
    const index = this.implementationGuide.extension.indexOf(param.extension);
    this.implementationGuide.extension.splice(index, index >= 0 ? 1 : 0);
    this.initParameters();
  }

  public addGlobal() {
    this.implementationGuide.global = this.implementationGuide.global || [];
    this.implementationGuide.global.push({ type: '', profile: { reference: '' } });
  }

  public changeId() {
    if (!confirm('Any changes to the implementation guide that are not saved will be lost. Continue?')) {
      return;
    }

    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resourceType = 'ImplementationGuide';
    modalRef.componentInstance.originalId = this.implementationGuide.id;

    modalRef.result.then(() => { this.igChanging.emit(true); });
  }

  public get urlAndNameMatch() : boolean {
    if (this.implementationGuide.url && !this.implementationGuide.url.endsWith('/'+this.implementationGuide.id)) {
      return false;
    }
    return true;
  }

  public selectPublishedIg(dependency: Extension) {
    const modalRef = this.modalService.open(PublishedIgSelectModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.result.then((guide: PublishedGuideModel) => {
      this.setDependencyLocation(dependency, guide.url);
      this.setDependencyID(dependency, guide['npm-name'])
      this.setDependencyName(dependency, guide['npm-name']);
      this.setDependencyVersion(dependency, guide.version);
      this.igChanging.emit(true);
    });
  }

  public removeDependency(dependency: Extension) {
    const index = this.implementationGuide.extension.indexOf(dependency);
    this.implementationGuide.extension.splice(index);
  }

  public addResources(destPackage?: PackageComponent) {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fhirVersion = 'stu3';
    modalRef.componentInstance.selectMultiple = true;

    modalRef.result.then((results: ResourceSelection[]) => {

      if (!results) return;

      if (!this.implementationGuide.package) {
        this.implementationGuide.package = [];
      }

      if (this.implementationGuide.package.length === 0) {
        this.implementationGuide.package.push({
          name: 'default',
          resource: []
        });
      }

      if (!destPackage) {
        destPackage = this.implementationGuide.package[0];
      }

      const allProfilingTypes = Globals.profileTypes.concat(Globals.terminologyTypes);

      if (!destPackage.resource) {
        destPackage.resource = [];
      }

      results.forEach((result: ResourceSelection) => {
        let found = false;

        // Determine if the resource is already referenced in one of the packages
        (this.implementationGuide.package || []).forEach((next: PackageComponent) => {
          const foundNext = (next.resource || []).find((resource: PackageResourceComponent) => {
            if (resource.sourceReference) {
              const parsed = parseReference(resource.sourceReference.reference);
              return parsed.resourceType === result.resourceType && parsed.id === result.id;
            }
          });

          if (foundNext) {
            found = true;
          }
        });

        if (!found) {
          destPackage.resource.push({
            sourceReference: {
              reference: result.resourceType + '/' + result.id,
              display: result.display
            },
            example: allProfilingTypes.indexOf(result.resourceType) < 0
          });
        }

        if (!this.fhirResource.references.find((r: IProjectResourceReference) => r.value == result.projectResourceId)) {
          const newProjectResourceReference: IProjectResourceReference = { value: result.projectResourceId, valueType: 'FhirResource' };
          this.fhirResource.references.push(newProjectResourceReference);
          this.resourceMap[result.resourceType + '/' + result.id] = newProjectResourceReference;
        }

      });

      this.initResources();
      this.igChanging.emit(true);
    });
  }

  public addDependency() {
    if (!this.implementationGuide.extension) {
      this.implementationGuide.extension = [];
    }

    const newDependency = new Extension();
    newDependency.url = Globals.extensionUrls['extension-ig-dependency'];
    newDependency.extension = [{
      url: Globals.extensionUrls['extension-ig-dependency-version'],
      valueString: 'current'
    }];

    this.implementationGuide.extension.push(newDependency);

    return newDependency;
  }

  public getDependencyID(dependency: Extension): string {
    const idExtension = (dependency.extension || []).find((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency-id']);

    if (idExtension) {
      return idExtension.valueUri;
    }
  }

  public setDependencyID(dependency: Extension, name: string) {
    let idExtension = (dependency.extension || []).find((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency-id']);

    if (!idExtension) {
      idExtension = new Extension();
      idExtension.url = Globals.extensionUrls['extension-ig-dependency-id'];

      if (!dependency.extension) {
        dependency.extension = [];
      }

      dependency.extension.push(idExtension);
    }

    idExtension.valueUri = name;
  }

  public getDependencyLocation(dependency: Extension): string {
    const locationExtension = (dependency.extension || []).find((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency-location']);

    if (locationExtension) {
      return locationExtension.valueUri;
    }
  }

  public setDependencyLocation(dependency: Extension, name: string) {
    let locationExtension = (dependency.extension || []).find((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency-location']);

    if (!locationExtension) {
      locationExtension = new Extension();
      locationExtension.url = Globals.extensionUrls['extension-ig-dependency-location'];

      if (!dependency.extension) {
        dependency.extension = [];
      }

      dependency.extension.push(locationExtension);
    }

    locationExtension.valueUri = name;
  }

  public getDependencyName(dependency: Extension): string {
    const nameExtension = (dependency.extension || []).find((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency-name']);

    if (nameExtension) {
      return nameExtension.valueString;
    }
  }

  public setDependencyName(dependency: Extension, name: string) {
    let nameExtension = (dependency.extension || []).find((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency-name']);

    if (!nameExtension) {
      nameExtension = new Extension();
      nameExtension.url = Globals.extensionUrls['extension-ig-dependency-name'];

      if (!dependency.extension) {
        dependency.extension = [];
      }

      dependency.extension.push(nameExtension);
    }

    nameExtension.valueString = name;
  }

  public getDependencyVersion(dependency: Extension): string {
    const versionExtension = (dependency.extension || []).find((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency-version']);

    if (versionExtension) {
      return versionExtension.valueString;
    }
  }

  public setDependencyVersion(dependency: Extension, version: string) {
    let versionExtension = (dependency.extension || []).find((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency-version']);

    if (!versionExtension) {
      versionExtension = new Extension();
      versionExtension.url = Globals.extensionUrls['extension-ig-dependency-version'];

      if (!dependency.extension) {
        dependency.extension = [];
      }

      dependency.extension.push(versionExtension);
    }

    versionExtension.valueString = version;
  }

  public addPackageEntry(packagesTabSet) {
    this.implementationGuide.package.push({ name: '', resource: [{ name: '', sourceUri: '', example: false }] });

    setTimeout(() => {
      const lastIndex = this.implementationGuide.package.length - 1;
      const newPackageTabId = 'package-' + lastIndex.toString();
      packagesTabSet.select(newPackageTabId);
    }, 50);    // 50ms timeout... should occur pretty quickly
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the implementation guide?')) {
      return;
    }

    this.getImplementationGuide();
  }

  private initParameters() {
    this.parameters = (this.implementationGuide.extension || [])
      .filter(e => e.url === Globals.extensionUrls['extension-ig-parameter'])
      .map(e => new Parameter(e));
  }

  private getImplementationGuide() {
    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    this.fhirResource = <IFhirResource>{};

    if (this.isFile) {
      if (this.fileService.file) {
        this.loadIG(this.fileService.file.resource);
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {
      forkJoin([
        this.implementationGuideService.getImplementationGuide(implementationGuideId),
        this.implementationGuideService.getReferenceMap(implementationGuideId)
      ])
        .subscribe({
          next: (results: [IFhirResource, IProjectResourceReferenceMap]) => {

            const conf: IFhirResource = results[0];

            if (!conf || !conf.resource || conf.resource.resourceType !== 'ImplementationGuide') {
              this.message = 'The specified implementation guide either does not exist or was deleted';
              return;
            }

            this.fhirResource = conf;
            this.resourceMap = results[1];
            this.loadIG(conf.resource);
          },
          error: (err) => {
            this.igNotFound = err.status === 404;
            this.message = getErrorString(err);
          }
        });
    }
  }

  public getResourceSourceType(resource) {
    if (resource.hasOwnProperty('sourceUri')) {
      return 'uri';
    } else if (resource.hasOwnProperty('sourceReference')) {
      return 'reference';
    }
  }

  public prompt(array, index, text, event = null) {
    const result = ClientHelper.promptForRemove(array, index, text, event);
    if (result) {
      this.igChanging.emit(true);
    }
  }

  public editPackageResourceModal(resource, content) {
    this.currentResource = resource;
    const modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });

    modalRef.result.then(() => { this.igChanging.emit(true); })
  }

  public tabChange(event) {
    if (event.nextId === 'resources') {
      this.initResources();
    }
  }

  public closePackageResourceModal(cb) {
    cb();
  }

  public setResourceSourceType(resource, type) {
    delete resource['sourceUri'];
    delete resource['sourceReference'];

    if (type === 'uri') {
      resource['sourceUri'] = '';
    } else if (type === 'reference') {
      resource['sourceReference'] = {
        reference: '',
        display: ''
      };
    }
  }

  public toggleRootPage(value: boolean) {
    if (value && !this.implementationGuide.page) {
      this.implementationGuide.page = new PageComponent();
      this.implementationGuide.page.kind = 'page';
      this.implementationGuide.page.format = 'markdown';
      this.implementationGuide.page.reuseDescription = true;
      this.implementationGuide.page.setTitle('Home Page', true);
    } else if (!value && this.implementationGuide.page) {
      const foundPageDef = this.pages.find((pageDef) => pageDef.page === this.implementationGuide.page);
      this.removePage(foundPageDef);
    }

    this.initPages();
  }

  public async editPage(pageDef: PageDefinition) {

    // get the page from db
    pageDef.resource = await firstValueFrom(this.nonFhirResourceService.getByName(pageDef.resource, this.implementationGuideId));

    const modalRef = this.modalService.open(PageComponentModalComponent, { size: 'lg', backdrop: 'static' });
    const componentInstance: PageComponentModalComponent = modalRef.componentInstance;

    componentInstance.implementationGuide = this.implementationGuide;

    if (this.implementationGuide.page === pageDef.page) {
      if(pageDef.resource.reuseDescription === undefined) {
        pageDef.resource["reuseDescription"] = true; // initialize it
      }
    }

    componentInstance.setPage(pageDef.page);
    componentInstance.setResource(pageDef.resource);

    modalRef.result.then((page: PageComponent) => {
      Object.assign(pageDef.page, page);
      this.initPages();
      this.igChanging.emit(true);
    });
  }

  private getNewPageSources(next = this.implementationGuide.page, pageSources: string[] = []) {
    if (next.source && next.source.match(/newPage(\d+)?\.md/)) {
      pageSources.push(next.source);
    }

    (next.page || []).forEach((childPage) => this.getNewPageSources(childPage, pageSources));

    return pageSources;
  }

  private getNewPageSource() {
    const sources = this.getNewPageSources();
    return 'newpage' + (sources.length + 1).toString() + '.html';
  }

  public addChildPage(pageDef: PageDefinition) {
    if (!pageDef.page.page) {
      pageDef.page.page = [];
    }

    const newPage = new PageComponent();
    newPage.kind = 'page';
    newPage.format = 'markdown';
    newPage.source = this.getNewPageSource();
    newPage.title = this.getNewPageTitle();
    pageDef.page.page.push(newPage);

    this.initPages();
  }

  private getNewPageTitles(next = this.implementationGuide.page, pageTitles: string[] = []) {
    if (next.title && next.title.match(/New Page( \d+)?/)) {
      pageTitles.push(next.title);
    }

    (next.page || []).forEach((childPage) => this.getNewPageTitles(childPage, pageTitles));

    return pageTitles;
  }

  private getNewPageTitle() {
    const titles = this.getNewPageTitles();
    return 'New Page ' + (titles.length + 1).toString();
  }

  public removePage(pageDef: PageDefinition) {
    if (!pageDef) {
      return;
    }

    if (pageDef.parent) {
      // Move child pages to the parent's children
      if (pageDef.page.page) {
        pageDef.parent.page.push(...pageDef.page.page);
      }

      // Remove the page
      const pageIndex = pageDef.parent.page.indexOf(pageDef.page);
      pageDef.parent.page.splice(pageIndex, 1);
    } else {
      // Remove the root page
      const children = this.implementationGuide.page.page;
      delete this.implementationGuide.page;

      // If there are children, move the first child to the root page
      if (children && children.length >= 1) {
        this.implementationGuide.page = children[0];
        children.splice(0, 1);

        if (children.length > 0) {
          this.implementationGuide.page.page = this.implementationGuide.page.page || [];
          this.implementationGuide.page.page.splice(0, 0, ...children);
        }
      }
    }
    //remove resource
    if (pageDef.resource['name']) {
      this.nonFhirResourceService.deleteByName(pageDef.resource, this.implementationGuideId).subscribe({
        next: (page: Page) => {
          let index = (this.fhirResource.references || []).findIndex((ref: IProjectResourceReference) => {
            return ref.value === page.id;
          });

          if (index > -1) {
            this.fhirResource.references.splice(index, 1);
          }
          this.initPages();
          this.igChanging.emit(true);
        },
        error: (err) => {
          this.initPages();
          this.igChanging.emit(true);
        }
      });
    } else {
      this.initPages();
      this.igChanging.emit(true);
    }

  }

  public isMovePageUpDisabled(pageDef: PageDefinition) {
    if (!pageDef.parent) {
      return true;
    }
    const index = pageDef.parent.page.indexOf(pageDef.page);
    return index === 0;
  }

  public movePageUp(pageDef: PageDefinition) {
    const index = pageDef.parent.page.indexOf(pageDef.page);
    pageDef.parent.page.splice(index, 1);
    pageDef.parent.page.splice(index - 1, 0, pageDef.page);
    this.initPages();
  }

  public isMovePageDownDisabled(pageDef: PageDefinition) {
    if (!pageDef.parent) {
      return true;
    }
    const index = pageDef.parent.page.indexOf(pageDef.page);
    return index === pageDef.parent.page.length - 1;
  }

  public movePageDown(pageDef: PageDefinition) {
    const index = pageDef.parent.page.indexOf(pageDef.page);
    pageDef.parent.page.splice(index, 1);
    pageDef.parent.page.splice(index + 1, 0, pageDef.page);
    this.initPages();
  }

  public async save() {
    if (!this.validation.valid && !confirm('This implementation guide is not valid, are you sure you want to save?')) {
      return;
    }

    this.saving = true;

    if (this.isFile) {
      this.fileService.saveFile();
      this.igChanging.emit(false);
      this.saving = false;
      return;
    }

    // save Ignore Warnings
    if (this.ignoreWarnings.id || this.ignoreWarnings.content) {
      this.ignoreWarnings.content = this.ignoreWarnings.content ?? '';
      this.ignoreWarnings = await firstValueFrom(this.nonFhirResourceService.save(this.ignoreWarnings.id, this.ignoreWarnings, this.implementationGuideId));
      if (!this.fhirResource.references.some(r => r.value === this.ignoreWarnings.id && r.valueType === 'NonFhirResource')) {
        this.fhirResource.references.push({ value: this.ignoreWarnings.id, valueType: 'NonFhirResource' });
      }
    }

    this.implementationGuideService.updateImplementationGuide(this.implementationGuideId, this.fhirResource)
      .subscribe({
        next: (conf: IFhirResource) => {
          if (this.isNew) {
            // noinspection JSIgnoredPromiseFromCall
            this.router.navigate([`projects/${this.implementationGuideId}/implementation-guide`]);
            this.saving = false;
          } else {
            this.fhirResource = conf;
            this.loadIG(conf.resource);
            this.configService.igContext = getImplementationGuideContext(conf);
            this.message = 'Your changes have been saved!';
            this.saving = false;
            setTimeout(() => {
              this.message = '';
            }, 3000);
          }

        },
        error: (err) => {
          this.message = 'An error occurred while saving the implementation guide: ' + getErrorString(err);
          this.saving = false;
        }
      });
  }

  public async delete(implementationGuideId) {
    if (!confirm(`Are you sure you want to delete ${this.implementationGuide.name}?`)) {
      return false;
    }

    const name = this.implementationGuide.name;
    const id = this.implementationGuide.id;
    if (!confirm(`Are you sure you want to delete`)) {
      return false;
    }

    this.projectService.deleteIg(implementationGuideId)
      .subscribe(async () => {
        await this.implementationGuideService.removeImplementationGuide(this.implementationGuide.id).toPromise().then((project) => {
          console.log(project);
          this.configService.igContext = null;
          this.router.navigate([`${this.configService.baseSessionUrl}`]);
          alert(`IG ${name} with id ${this.implementationGuide.id} has been deleted`);
        }).catch((err) => this.message = getErrorString(err));
      }, (err) => {
        this.message = 'An error occurred while saving the implementation guide: ' + getErrorString(err);
      });

  }

  public editImplementationGuideResource(igResource: ImplementationGuideResource) {
    const modalRef = this.modalService.open(STU3ResourceModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.implementationGuide = this.implementationGuide;
    modalRef.componentInstance.resource = igResource.resource;

    modalRef.result.then(() => { this.igChanging.emit(true); });
  }

  public initResources() {
    this.resources = (this.implementationGuide.package || []).reduce((list, igPackage: PackageComponent) => {
      const packageResources = (igPackage.resource || [])
        .map((resource: PackageResourceComponent) => {
          return new ImplementationGuideResource(resource, igPackage);
        })
        .sort((a: ImplementationGuideResource, b: ImplementationGuideResource) => {
          const aVal: string = a.resource.sourceReference.reference || a.resource.sourceReference.display || a.igPackage.name;
          const bVal: string = b.resource.sourceReference.reference || b.resource.sourceReference.display || b.igPackage.name;
          return (aVal || '').localeCompare(bVal || '');
        });
      return list.concat(packageResources);
    }, []);
  }

  public removeResource(igResource: ImplementationGuideResource) {
    if (!confirm('Are you sure you want to remove this resource from the implementation guide? Doing this will *not* delete the resource itself, it *only* removes it from the implementation guide.')) {
      return;
    }

    const packageResourceIndex = igResource.igPackage.resource.indexOf(igResource.resource);
    igResource.igPackage.resource.splice(packageResourceIndex, 1);

    if (igResource.igPackage.resource.length === 0) {
      const packageIndex = this.implementationGuide.package.indexOf(igResource.igPackage);
      this.implementationGuide.package.splice(packageIndex, 1);
    }

    let map = this.resourceMap[igResource.resource.sourceReference.reference];

     let index = (this.fhirResource.references || []).findIndex((ref: IProjectResourceReference) => {
      return ref.value === map.value
    });

    if (index > -1) {
      this.fhirResource.references.splice(index, 1);
      delete this.resourceMap[igResource.resource.sourceReference.reference];
    }

    if (index > -1) {
      this.fhirResource.references.splice(index, 1);
    }

    this.initResources();
    this.igChanging.emit(true);
  }

  public changeResourcePackage(igResource: ImplementationGuideResource, newPackage: PackageComponent) {
    const originalResourceIndex = igResource.igPackage.resource.indexOf(igResource.resource);
    igResource.igPackage.resource.splice(originalResourceIndex, 1);
    newPackage.resource.push(igResource.resource);
    this.initResources();
  }

  private initPage(page: PageComponent, level = 0, parent?: PageComponent) {
    if (!page) {
      return;
    }

    // get the resource
    let resource = new Page();
    resource.name  = page.source.slice(0,page.source.indexOf("."));


    this.pages.push({
      page: page,
      level: level,
      parent: parent,
      resource: resource
    });

    if (page.page) {
      for (let i = 0; i < page.page.length; i++) {
        this.initPage(page.page[i], level + 1, page);
      }
    }
  }

  private initPages() {
    this.pages = [];
    this.initPage(this.implementationGuide.page);
  }

  public async loadIG(newVal: IDomainResource, isDirty?: boolean) {
    this.implementationGuide = new ImplementationGuide(newVal);

    if (this.fhirResource) {
      this.fhirResource.resource = this.implementationGuide;
    }

    // ignore warnings
    if (!this.ignoreWarnings) {
      let ignoreWarnings = new IgnoreWarnings();
      let res =  await firstValueFrom(this.nonFhirResourceService.getByType(ignoreWarnings, this.fhirResource.id));
      if(res.id){
        this.ignoreWarnings = res;
      }
      else{
        this.ignoreWarnings = ignoreWarnings;
      }
    }

    this.igChanging.emit(isDirty);
    this.initPages();
    this.initParameters();
  }

  ngOnInit() {
    //this.isDirty = false;
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/implementation-guide/')) {
        this.getImplementationGuide();
      }
    });
    this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.getImplementationGuide();

    // Watch the route parameters to see if the id of the implementation guide changes. Reload if it does.
    this.route.params.subscribe((params) => {
      if (!this.implementationGuideId) {
        this.implementationGuideId = params.implementationGuideId;
      }

      if (params.implementationGuideId && this.implementationGuide && params.implementationGuideId !== this.implementationGuideId) {
        this.getImplementationGuide();
      }
    });
  }

  public canDeactivate(): boolean {
    return !this.isDirty;
  }

  ngOnDestroy() {
    if (this.navSubscription) this.navSubscription.unsubscribe();
    this.configService.setTitle(null);
  }

  ngDoCheck() {
    if (this.implementationGuide) {
      this.validation = this.fhirService.validate(this.implementationGuide);
    }
  }
}
