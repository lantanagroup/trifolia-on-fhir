import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/auth.service';
import {
  Binary,
  Coding,
  Extension,
  ImplementationGuide,
  OperationOutcome, PackageComponent, PackageResourceComponent,
  PageComponent
} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ImplementationGuideService, PublishedGuideModel} from '../../shared/implementation-guide.service';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PageComponentModalComponent} from './page-component-modal.component';
import {FhirService} from '../../shared/fhir.service';
import {FileService} from '../../shared/file.service';
import {ConfigService} from '../../shared/config.service';
import {PublishedIgSelectModalComponent} from '../../modals/published-ig-select-modal/published-ig-select-modal.component';
import {ValidatorResponse} from 'fhir/validator';
import {
  FhirReferenceModalComponent,
  ResourceSelection
} from '../../fhir-edit/reference-modal/reference-modal.component';
import {ClientHelper} from '../../clientHelper';
import {BaseComponent} from '../../base.component';
import { getErrorString, parseReference } from '../../../../../../libs/tof-lib/src/lib/helper';
import {STU3ResourceModalComponent} from './resource-modal.component';
import {ChangeResourceIdModalComponent} from '../../modals/change-resource-id-modal/change-resource-id-modal.component';

class PageDefinition {
  public page: PageComponent;
  public parent?: PageComponent;
  public level: number;
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
export class STU3ImplementationGuideComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  public implementationGuide: ImplementationGuide;
  public message: string;
  public currentResource: any;
  public validation: ValidatorResponse;
  public pages: PageDefinition[];
  public resourceTypeCodes: Coding[] = [];
  public igNotFound = false;
  public Globals = Globals;
  public ClientHelper = ClientHelper;

  private navSubscription: any;
  // noinspection JSMismatchedCollectionQueryUpdate
  private resources: ImplementationGuideResource[] = [];

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private implementationGuideService: ImplementationGuideService,
    private fileService: FileService,
    private fhirService: FhirService,
    protected authService: AuthService,
    public configService: ConfigService) {

    super(configService, authService);

    this.implementationGuide = new ImplementationGuide({ meta: this.authService.getDefaultMeta() });
  }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('implementationGuideId');
    return !id || id === 'new';
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('implementationGuideId') === 'from-file';
  }

  public get dependencies(): Extension[] {
    return (this.implementationGuide.extension || []).filter((extension: Extension) => extension.url === Globals.extensionUrls['extension-ig-dependency']);
  }

  public get packageId(): string {
    const foundExtension = (this.implementationGuide.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-package-id']);

    if (foundExtension) {
      return foundExtension.valueString;
    }
  }

  public set packageId(value: string) {
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

  public changeId() {
    if (!confirm('Any changes to the implementation guide that are not saved will be lost. Continue?')) {
      return;
    }

    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, { size: 'lg' });
    modalRef.componentInstance.resourceType = 'ImplementationGuide';
    modalRef.componentInstance.originalId = this.implementationGuide.id;
  }

  public selectPublishedIg(dependency: Extension) {
    const modalRef = this.modalService.open(PublishedIgSelectModalComponent, {size: 'lg'});
    modalRef.result.then((guide: PublishedGuideModel) => {
      this.setDependencyLocation(dependency, guide.url);
      this.setDependencyName(dependency, guide['npm-name']);
      this.setDependencyVersion(dependency, guide.version);
    });
  }

  public removeDependency(dependency: Extension) {
    const index = this.implementationGuide.extension.indexOf(dependency);
    this.implementationGuide.extension.splice(index);
  }

  public addResources(destPackage?: PackageComponent) {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, {size: 'lg'});
    modalRef.componentInstance.selectMultiple = true;

    modalRef.result.then((results: ResourceSelection[]) => {
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
      });

      this.initResources();
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
    this.implementationGuide.package.push({name: '', resource: [{name: '', sourceUri: '', example: false}]});

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

  private getImplementationGuide() {
    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    if (this.isFile) {
      if (this.fileService.file) {
        this.implementationGuide = <ImplementationGuide>this.fileService.file.resource;
        this.nameChanged();
        this.initPages();
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {
      this.implementationGuide = null;

      this.implementationGuideService.getImplementationGuide(implementationGuideId)
        .subscribe((results: ImplementationGuide | OperationOutcome) => {
          if (results.resourceType !== 'ImplementationGuide') {
            this.message = 'The specified implementation guide either does not exist or was deleted';
            return;
          }

          this.implementationGuide = <ImplementationGuide>results;
          this.nameChanged();
          this.initPages();
        }, (err) => {
          this.igNotFound = err.status === 404;
          this.message = getErrorString(err);
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

  public editPackageResourceModal(resource, content) {
    this.currentResource = resource;
    this.modalService.open(content, {size: 'lg'});
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
      this.implementationGuide.page.title = 'New Page';
      this.implementationGuide.page.format = 'markdown';
      this.implementationGuide.page.source = 'newPage.md';
    } else if (!value && this.implementationGuide.page) {
      const foundPageDef = this.pages.find((pageDef) => pageDef.page === this.implementationGuide.page);
      this.removePage(foundPageDef);
    }

    this.initPages();
  }

  public editPage(pageDef: PageDefinition) {
    const modalRef = this.modalService.open(PageComponentModalComponent, {size: 'lg'});
    const componentInstance: PageComponentModalComponent = modalRef.componentInstance;

    componentInstance.implementationGuide = this.implementationGuide;
    componentInstance.setPage(pageDef.page);
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
    return 'newPage' + (sources.length + 1).toString() + '.md';
  }

  public addChildPage(pageDef: PageDefinition) {
    if (!this.implementationGuide.contained) {
      this.implementationGuide.contained = [];
    }

    if (!pageDef.page.page) {
      pageDef.page.page = [];
    }

    const newBinary = new Binary();
    newBinary.contentType = 'text/markdown';
    newBinary.content = btoa('No page content yet');
    newBinary.id = Globals.generateRandomNumber(5000, 10000).toString();
    this.implementationGuide.contained.push(newBinary);

    const newPage = new PageComponent();
    newPage.kind = 'page';
    newPage.format = 'markdown';
    newPage.extension = [{
      url: Globals.extensionUrls['extension-ig-page-content'],
      valueReference: {
        reference: '#' + newBinary.id,
        display: `Page content ${newBinary.id}`
      }
    }];
    newPage.source = this.getNewPageSource();
    pageDef.page.page.push(newPage);

    this.initPages();
  }

  public removePage(pageDef: PageDefinition) {
    if (!pageDef) {
      return;
    }

    if (pageDef.page.page) {
      for (let i = pageDef.page.page.length - 1; i >= 0; i--) {
        const childPage = pageDef.page.page[i];
        const foundChildPageDef = this.pages.find((nextPageDef) => nextPageDef.page === childPage);
        this.removePage(foundChildPageDef);
      }
    }

    // If a contained Binary resource is associated with the page, remove it
    if (pageDef.page.source) {
      if (pageDef.page.source.startsWith('#')) {
        const foundBinary = (this.implementationGuide.contained || []).find((contained) =>
          contained.id === pageDef.page.source.substring(1));

        if (foundBinary) {
          const binaryIndex = this.implementationGuide.contained.indexOf(foundBinary);
          this.implementationGuide.contained.splice(binaryIndex, 1);
        }
      }
    }

    // Remove the page
    if (pageDef.parent) {
      const pageIndex = pageDef.parent.page.indexOf(pageDef.page);
      pageDef.parent.page.splice(pageIndex, 1);
    } else {
      delete this.implementationGuide.page;
    }

    const pageDefIndex = this.pages.indexOf(pageDef);
    this.pages.splice(pageDefIndex, 1);
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

  public save() {
    if (!this.validation.valid && !confirm('This implementation guide is not valid, are you sure you want to save?')) {
      return;
    }

    if (this.isFile) {
      this.fileService.saveFile();
      return;
    }

    this.implementationGuideService.saveImplementationGuide(this.implementationGuide)
      .subscribe((implementationGuide: ImplementationGuide) => {
        if (this.isNew) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.fhirServer}/${implementationGuide.id}/implementation-guide`]);
        } else {
          this.message = 'Your changes have been saved!';
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      }, (err) => {
        this.message = 'An error occurred while saving the implementation guide: ' + getErrorString(err);
      });
  }

  public editImplementationGuideResource(igResource: ImplementationGuideResource) {
    const modalRef = this.modalService.open(STU3ResourceModalComponent, { size: 'lg'});
    modalRef.componentInstance.implementationGuide = this.implementationGuide;
    modalRef.componentInstance.resource = igResource.resource;
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

    this.initResources();
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

    this.pages.push({
      page: page,
      level: level,
      parent: parent
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

  ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/implementation-guide/')) {
        this.getImplementationGuide();
      }
    });
    this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.getImplementationGuide();

    // Watch the route parameters to see if the id of the implementation guide changes. Reload if it does.
    this.route.params.subscribe((params) => {
      if (params.implementationGuideId && this.implementationGuide && params.implementationGuideId !== this.implementationGuide.id) {
        this.getImplementationGuide();
      }
    });
  }

  nameChanged() {
    this.configService.setTitle(`ImplementationGuide - ${this.implementationGuide.name || 'no-name'}`);
  }

  ngOnDestroy() {
    this.navSubscription.unsubscribe();
    this.configService.setTitle(null);
  }

  ngDoCheck() {
    if (this.implementationGuide) {
      this.validation = this.fhirService.validate(this.implementationGuide);
    }
  }
}
