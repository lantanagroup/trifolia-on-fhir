import {
  Component,
  DoCheck,
  EventEmitter, HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {AuthService} from '../../shared/auth.service';
import {
  Binary,
  Coding,
  Extension,
  ImplementationGuide,
  ImplementationGuideDefinitionComponent,
  ImplementationGuideDependsOnComponent,
  ImplementationGuideGroupingComponent,
  ImplementationGuidePageComponent,
  ImplementationGuideResourceComponent,
  OperationOutcome,
  ResourceReference
} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {ActivatedRoute, Router} from '@angular/router';
import {ImplementationGuideService, PublishedGuideModel} from '../../shared/implementation-guide.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {PageComponentModalComponent} from './page-component-modal.component';
import {FhirService} from '../../shared/fhir.service';
import {FileService} from '../../shared/file.service';
import {ConfigService} from '../../shared/config.service';
import {PublishedIgSelectModalComponent} from '../../modals/published-ig-select-modal/published-ig-select-modal.component';
import {FhirReferenceModalComponent, ResourceSelection} from '../../fhir-edit/reference-modal/reference-modal.component';
import {getErrorString, parseReference} from '../../../../../../libs/tof-lib/src/lib/helper';
import {R4ResourceModalComponent} from './resource-modal.component';
import {getDefaultImplementationGuideResourcePath, getImplementationGuideMediaReferences, MediaReference} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {ChangeResourceIdModalComponent} from '../../modals/change-resource-id-modal/change-resource-id-modal.component';
import {GroupModalComponent} from './group-modal.component';
import {BaseImplementationGuideComponent} from '../base-implementation-guide-component';
import {CanComponentDeactivate} from '../../guards/resource.guard';

class PageDefinition {
  public page: ImplementationGuidePageComponent;
  public parent?: ImplementationGuidePageComponent;
  public level: number;
}

@Component({
  templateUrl: './implementation-guide.component.html',
  styleUrls: ['./implementation-guide.component.css']
})
export class R4ImplementationGuideComponent extends BaseImplementationGuideComponent implements OnInit, OnDestroy, DoCheck, CanComponentDeactivate {
  @Input() public implementationGuide: ImplementationGuide;
  public message: string;
  public validation: any;
  public pages: PageDefinition[];
  public resourceTypeCodes: Coding[] = [];
  public newFhirVersion: string;
  public filterResourceType = {
    profile: true,
    terminology: true,
    example: true
  };
  public filterResourceQuery: string;
  public igNotFound = false;
  public selectedPage: PageDefinition;
  public igChanging: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private modal: NgbModal,
    private router: Router,
    public implementationGuideService: ImplementationGuideService,
    private fileService: FileService,
    private fhirService: FhirService,
    protected authService: AuthService,
    public configService: ConfigService,
    public route: ActivatedRoute) {

    super(configService, authService);

    this.implementationGuide = new ImplementationGuide({ meta: this.authService.getDefaultMeta() });

    this.igChanging.subscribe((value) => {
      this.isDirty = value;
      this.configService.setTitle(`ImplementationGuide - ${this.implementationGuide.name || 'no-name'}`, this.isDirty);
    });
  }

  protected get packageId(): string {
    return this.implementationGuide.packageId;
  }

  protected set packageId(value: string) {
    this.implementationGuide.packageId = value;
    this.packageIdChanged();
  }

  public get mediaReferences(): MediaReference[] {
    return getImplementationGuideMediaReferences('r4', this.implementationGuide);
  }

  public get resources(): ImplementationGuideResourceComponent[] {
    if (!this.implementationGuide.definition) {
      return [];
    }

    const terminologyTypes = ['ValueSet', 'CodeSystem', 'ConceptMap'];

    return (this.implementationGuide.definition.resource || [])
      .filter((resource: ImplementationGuideResourceComponent) => {
        if (!resource.reference || !resource.reference.reference) {
          return true;
        }

        const parsedReference = parseReference(resource.reference.reference);

        if (this.filterResourceType.profile && Globals.profileTypes.indexOf(parsedReference.resourceType) >= 0) {
          return true;
        }

        if (this.filterResourceType.terminology && terminologyTypes.indexOf(parsedReference.resourceType) >= 0) {
          return true;
        }

        return this.filterResourceType.example && Globals.profileTypes.concat(terminologyTypes).indexOf(parsedReference.resourceType) < 0;
      })
      .filter((resource: ImplementationGuideResourceComponent) => {
        if (!this.filterResourceQuery) {
          return true;
        }

        const reference = resource.reference && resource.reference.reference ?
          resource.reference.reference.toLowerCase().trim() :
          '';
        /*
        const name = resource.name ?
          resource.name.toLowerCase().trim() :
          '';
         */

        return reference.indexOf(this.filterResourceQuery.toLowerCase().trim()) >= 0;
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
    const regexp: RegExp = /[^A-Za-z0-9\._\-]/;
    return page.page && page.page.fileName && regexp.test(page.page.fileName);
  }

  public get isFilterResourceTypeAll() {
    return this.filterResourceType.profile && this.filterResourceType.terminology && this.filterResourceType.example;
  }

  public addDependencies(){
    if(!this.implementationGuide.dependsOn){
      this.implementationGuide.dependsOn = [{
        uri: '',
        version: ''
      }];
    }
    else{
      this.implementationGuide.dependsOn.push({
        uri: '',
        version: ''
      });
    }
  }

  public packageIdChanged() {
    if (this.packageId) {
      const packageIdParts = this.packageId.toLowerCase().split('.');

      if (packageIdParts.length >= 3 && packageIdParts[0] === 'hl7' && packageIdParts[2] === 'us') {
        this.implementationGuide.jurisdiction = this.implementationGuide.jurisdiction || [];

        let found = this.implementationGuide.jurisdiction.find(j => j.coding && j.coding.length > 0 && j.coding[0].system === 'urn:iso:std:iso:3166:-2');

        if (!found) {
          found = {
            coding: [{
              system: 'urn:iso:std:iso:3166:-2'
            }]
          };
          this.implementationGuide.jurisdiction.push(found);
        }

        found.coding[0].code = 'US';
      }
    }
  }

  public addGrouping() {
    if (!this.implementationGuide.definition) {
      this.implementationGuide.definition = {
        resource: []
      };
    }

    this.implementationGuide.definition.grouping = this.implementationGuide.definition.grouping || [];

    const newId = 'new-group' + (this.implementationGuide.definition.grouping.filter(g => g.id && g.id.startsWith('new-group')).length + 1);

    this.implementationGuide.definition.grouping.push({
      id: newId,
      name: 'New Group'
    });
  }

  public moveGroupUp(group: ImplementationGuideGroupingComponent) {
    const index = this.implementationGuide.definition.grouping.indexOf(group);

    if (index === 0) return;

    this.implementationGuide.definition.grouping.splice(index, 1);
    this.implementationGuide.definition.grouping.splice(index - 1, 0, group);
  }

  public sortGroups() {
    if (!this.implementationGuide.definition || !this.implementationGuide.definition.grouping) return;

    const originalSortNames = this.implementationGuide.definition.grouping.map(g => g.name || '');

    this.implementationGuide.definition.grouping.sort((a, b) => {
      const aName = a.name || '';
      const bName = b.name || '';
      return aName.localeCompare(bName);
    });

    const newSortNames = this.implementationGuide.definition.grouping.map(g => g.name || '');
    const isSame = originalSortNames.every((value, index) => value === newSortNames[index]);

    if (isSame) {
      this.implementationGuide.definition.grouping = this.implementationGuide.definition.grouping.reverse();
    }
  }

  public moveGroupDown(group: ImplementationGuideGroupingComponent) {
    const index = this.implementationGuide.definition.grouping.indexOf(group);

    if (index === this.implementationGuide.definition.grouping.length - 1) return;

    this.implementationGuide.definition.grouping.splice(index, 1);
    this.implementationGuide.definition.grouping.splice(index + 1, 0, group);
  }

  public editGroup(group: ImplementationGuideGroupingComponent) {
    const modalRef = this.modal.open(GroupModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.group = group;
    modalRef.componentInstance.implementationGuide = this.implementationGuide;
    modalRef.result.then(() => {this.igChanging.emit(true);});
  }

  public removeGroup(group: ImplementationGuideGroupingComponent) {
    if (!confirm('This will remove the grouping from the implementation guide and any references to it from resources within the implementation guide. Are you sure you want to continue?')) {
      return;
    }

    (this.implementationGuide.definition.resource || [])
      .filter(r => r.groupingId === group.id)
      .forEach(r => delete r.groupingId);

    const index = this.implementationGuide.definition.grouping.indexOf(group);
    this.implementationGuide.definition.grouping.splice(index, 1);
  }

  public moveResource(resource: ImplementationGuideResourceComponent, direction: 'up'|'down') {
    const index = this.implementationGuide.definition.resource.indexOf(resource);

    if (direction === 'up') {
      if (index > 0) {
        this.implementationGuide.definition.resource.splice(index, 1);
        this.implementationGuide.definition.resource.splice(index - 1, 0, resource);
      }
    } else if (direction === 'down') {
      if (index < this.implementationGuide.definition.resource.length - 1) {
        this.implementationGuide.definition.resource.splice(index, 1);
        this.implementationGuide.definition.resource.splice(index + 1, 0, resource);
      }
    }
  }

  public editResource(resource: ImplementationGuideResourceComponent) {
    const modalRef = this.modal.open(R4ResourceModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resource = resource;
    modalRef.componentInstance.implementationGuide = this.implementationGuide;
    modalRef.result.then(() => {this.igChanging.emit(true)})
  }

  public changeId() {
    if (!confirm('Any changes to the implementation guide that are not saved will be lost. Continue?')) {
      return;
    }

    const modalRef = this.modal.open(ChangeResourceIdModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resourceType = 'ImplementationGuide';
    modalRef.componentInstance.originalId = this.implementationGuide.id;

    modalRef.result.then(() => {this.igChanging.emit(true)});
  }

  public sortResources() {
    if (!this.implementationGuide.definition || !this.implementationGuide.definition.resource) return;

    const originalSortNames = this.implementationGuide.definition.resource.map(r => r.name || '');

    this.implementationGuide.definition.resource.sort((a, b) => {
      const compareA = a.name || '';
      const compareB = b.name || '';
      return compareA.localeCompare(compareB);
    });

    const newSortNames = this.implementationGuide.definition.resource.map(r => r.name || '');
    const isSame = originalSortNames.every((value, index) => value === newSortNames[index]);

    if (isSame) {
      this.implementationGuide.definition.resource = this.implementationGuide.definition.resource.reverse();
    }
  }

  public addResources() {
    if (!this.implementationGuide.definition) this.implementationGuide.definition = { resource: [] };
    if (!this.implementationGuide.definition.resource) this.implementationGuide.definition.resource = [];

    const modalRef = this.modal.open(FhirReferenceModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.selectMultiple = true;

    modalRef.result.then((results: ResourceSelection[]) => {
      if (!this.implementationGuide.definition) {
        this.implementationGuide.definition = new ImplementationGuideDefinitionComponent();
        this.implementationGuide.definition.resource = [];
      }

      const allProfilingTypes = Globals.profileTypes.concat(Globals.terminologyTypes);

      results.forEach((result: ResourceSelection) => {
        const newReference: ResourceReference = {
          reference: result.resourceType + '/' + result.id,
          display: result.display
        };

        let tempObj;

        if(allProfilingTypes.indexOf(result.resourceType) < 0 && result.resource.meta.profile){
          tempObj = {
            extension: [{
              url: Globals.extensionUrls['extension-ig-resource-file-path'],
              valueString: getDefaultImplementationGuideResourcePath(newReference)
            }],
            reference: newReference,
            name: result.display,
            exampleFor: result.resource.meta.profile
          };
        }
        else {
          tempObj = {
            extension: [{
              url: Globals.extensionUrls['extension-ig-resource-file-path'],
              valueString: getDefaultImplementationGuideResourcePath(newReference)
            }],
            reference: newReference,
            name: result.display,
            exampleBoolean: allProfilingTypes.indexOf(result.resourceType) < 0
          };
        }

        this.implementationGuide.definition.resource.push(tempObj);
      });
    });
  }

  public toggleFilterResourceType(type: string) {
    switch (type) {
      case 'all':
        this.filterResourceType.profile = true;
        this.filterResourceType.terminology = true;
        this.filterResourceType.example = true;
        break;
      case 'profile':
        this.filterResourceType.profile = !this.filterResourceType.profile;
        break;
      case 'terminology':
        this.filterResourceType.terminology = !this.filterResourceType.terminology;
        break;
      case 'example':
        this.filterResourceType.example = !this.filterResourceType.example;
        break;
    }
  }

  public isDuplicateResource(resource: ImplementationGuideResourceComponent) {
    const thisReference = resource && resource.reference && resource.reference.reference ?
      resource.reference.reference.trim().toLowerCase() : null;

    const found = (this.implementationGuide.definition.resource || []).filter((next: ImplementationGuideResourceComponent) =>
      next.reference && next.reference.reference && next.reference.reference.trim().toLowerCase() === thisReference);

    return found.length !== 1;
  }

  public addNewFhirVersion() {
    this.implementationGuide.fhirVersion.push(this.newFhirVersion);
    this.newFhirVersion = null;
  }

  public removeResource(resource: ImplementationGuideResourceComponent) {
    if (!confirm('Are you sure you want to remove this resource from the implementation guide?')) {
      return;
    }

    if (this.implementationGuide.definition && this.implementationGuide.definition.resource) {
      const index = this.implementationGuide.definition.resource.indexOf(resource);
      this.implementationGuide.definition.resource.splice(index, 1);
    }
  }

  public selectPublishedIg(dependsOn: ImplementationGuideDependsOnComponent) {
    const modalRef = this.modal.open(PublishedIgSelectModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.result.then((guide: PublishedGuideModel) => {
      if(guide){
        dependsOn.packageId = guide['npm-name'];
        dependsOn.uri = guide.url;
        dependsOn.version = guide.version;
        this.igChanging.emit(true);
      }
    });
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the implementation guide?')) {
      return;
    }

    this.igChanging.emit(true);
    this.getImplementationGuide();
  }

  private getImplementationGuide() {
    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    if (this.isFile) {
      if (this.fileService.file) {
        this.implementationGuide = new ImplementationGuide(this.fileService.file.resource);
        this.igChanging.emit(false);
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

          this.implementationGuide = new ImplementationGuide(results);
          this.igChanging.emit(false);
          this.initPages();
        }, (err) => {
          this.igNotFound = err.status === 404;
          this.message = getErrorString(err);
        });
    }
  }

  public toggleResources(hasResources: boolean) {
    if (!hasResources && this.implementationGuide.definition && this.implementationGuide.definition.resource) {
      delete this.implementationGuide.definition.resource;
    } else if (hasResources) {
      if (!this.implementationGuide.definition) {
        this.implementationGuide.definition = new ImplementationGuideDefinitionComponent();
      }

      if (!this.implementationGuide.definition.resource) {
        this.implementationGuide.definition.resource = [];
      }

      if (this.implementationGuide.definition.resource.length === 0) {
        const newResource = new ImplementationGuideResourceComponent();
        newResource.reference = new ResourceReference();
        newResource.reference.reference = '';
        newResource.reference.display = '';
        this.implementationGuide.definition.resource.push(newResource);
      }
    }
  }

  public toggleRootPage(value: boolean) {
    if (value && !this.implementationGuide.definition) {
      this.implementationGuide.definition = new ImplementationGuideDefinitionComponent();
    }

    if (value && !this.implementationGuide.definition.page) {
      this.implementationGuide.definition.page = new ImplementationGuidePageComponent();
      this.implementationGuide.definition.page.generation = 'markdown';
      this.implementationGuide.definition.page.reuseDescription = true;
      this.implementationGuide.definition.page.setTitle('Home Page', true);
    } else if (!value && this.implementationGuide.definition.page) {
      const foundPageDef = this.pages.find((pageDef) => pageDef.page === this.implementationGuide.definition.page);
      this.removePage(foundPageDef);
    }

    this.initPages();
  }

  public editPage(pageDef: PageDefinition) {
    const modalRef = this.modal.open(PageComponentModalComponent, {size: 'lg', backdrop: 'static'});
    const componentInstance: PageComponentModalComponent = modalRef.componentInstance;

    componentInstance.implementationGuide = this.implementationGuide;

    if (this.implementationGuide.definition.page === pageDef.page) {
      componentInstance.rootPage = true;
    }

    componentInstance.setPage(pageDef.page);

    modalRef.result.then((page: ImplementationGuidePageComponent) => {
      Object.assign(pageDef.page, page);
      this.initPages();
      this.igChanging.emit(true);
    });

  }

  private getNewPageTitles(next = this.implementationGuide.definition.page, pageTitles: string[] = []) {
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

  public addChildPage(pageDef: PageDefinition, template?: 'downloads') {
    if (!pageDef.page.page) {
      pageDef.page.page = [];
    }

    const newPage = new ImplementationGuidePageComponent();
    newPage.generation = 'markdown';

    if (template === 'downloads') {
      newPage.title = 'Downloads';
      newPage.navMenu = 'Downloads';
      newPage.fileName = 'downloads.md';
      newPage.contentMarkdown = '**Full Implementation Guide**\\n\\nThe entire implementation guide (including the HTML files, definitions, validation information, etc.) may be downloaded [here](full-ig.zip).\\n\\nIn addition there are format specific definitions files.\\n\\n* [XML](definitions.xml.zip)\\n* [JSON](definitions.json.zip)\\n* [TTL](definitions.ttl.zip)\\n\\n**Examples:** all the examples that are used in this Implementation Guide available for download:\\n\\n* [XML](examples.xml.zip)\\n* [JSON](examples.json.zip)\\n* [TTl](examples.ttl.zip)';
    } else {
      newPage.title = this.getNewPageTitle();
      newPage.fileName = Globals.getCleanFileName(newPage.title).toLowerCase() + '.md';
    }

    pageDef.page.page.push(newPage);

    this.initPages();
  }

  public removePage(pageDef: PageDefinition) {
    if (!pageDef || !confirm('Are you sure you want to remove this page?')) {
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
      const children = this.implementationGuide.definition.page.page;
      delete this.implementationGuide.definition.page;

      // If there are children, move the first child to the root page
      if (children && children.length >= 1) {
        this.implementationGuide.definition.page = children[0];
        children.splice(0, 1);

        if (children.length > 0) {
          this.implementationGuide.definition.page.page = this.implementationGuide.definition.page.page || [];
          this.implementationGuide.definition.page.page.splice(0, 0, ...children);
        }
      }
    }

    this.initPages();
    this.igChanging.emit(true);
  }

  public isMovePageUpDisabled(pageDef: PageDefinition) {
    if (!pageDef.parent) {
      return true;
    }
    const index = pageDef.parent.page.indexOf(pageDef.page);
    return index === 0;
  }

  public movePageUp(pageDef: PageDefinition) {
    if (this.isMovePageUpDisabled(pageDef)) return;
    const index = pageDef.parent.page.indexOf(pageDef.page);
    pageDef.parent.page.splice(index, 1);
    pageDef.parent.page.splice(index - 1, 0, pageDef.page);
    this.initPages();
    this.igChanging.emit(true);
  }

  public isMovePageDownDisabled(pageDef: PageDefinition) {
    if (!pageDef.parent) {
      return true;
    }
    const index = pageDef.parent.page.indexOf(pageDef.page);
    return index === pageDef.parent.page.length - 1;
  }

  public movePageDown(pageDef: PageDefinition) {
    if (this.isMovePageDownDisabled(pageDef)) return;
    const index = pageDef.parent.page.indexOf(pageDef.page);
    pageDef.parent.page.splice(index, 1);
    pageDef.parent.page.splice(index + 1, 0, pageDef.page);
    this.initPages();
    this.igChanging.emit(true);
  }

  public isMovePageOutDisabled(pageDef: PageDefinition) {
    if (!pageDef.parent || pageDef.parent === this.implementationGuide.definition.page) return true;

    // Must have a grand-parent to move this page to a child of
    const parentPageDef = this.pages.find(y => y.page === pageDef.parent);
    return !parentPageDef.parent;
  }

  public movePageOut(pageDef: PageDefinition) {
    if (this.isMovePageOutDisabled(pageDef)) return;
    const parentPage = pageDef.parent;

    // Remove the page from it's current parent
    const currentIndex = parentPage.page.indexOf(pageDef.page);
    parentPage.page.splice(currentIndex, currentIndex >= 0 ? 1 : 0);

    // Add the page the grand-parent
    const parentPageDef = this.pages.find(y => y.page === parentPage);
    const grandParentPage = parentPageDef.parent;
    const parentIndex = grandParentPage.page.indexOf(parentPage);
    grandParentPage.page.splice(parentIndex + 1, 0, pageDef.page);

    this.initPages();
    this.igChanging.emit(true);
  }

  public isMovePageInDisabled(pageDef: PageDefinition) {
    if (!pageDef.parent) return true;
    const currentIndex = pageDef.parent.page.indexOf(pageDef.page);
    return pageDef.page === this.implementationGuide.definition.page || pageDef.parent.page.length === 1 || currentIndex === 0;
  }

  public movePageIn(pageDef: PageDefinition) {
    if (this.isMovePageInDisabled(pageDef)) return;
    const parentPage = pageDef.parent;

    // Remove the page from it's current parent
    const currentIndex = parentPage.page.indexOf(pageDef.page);
    parentPage.page.splice(currentIndex, currentIndex >= 0 ? 1 : 0);

    // Add the current page to the previous sibling
    const newParentPage = parentPage.page[currentIndex - 1];
    newParentPage.page = newParentPage.page || [];
    newParentPage.page.push(pageDef.page);

    this.initPages();
    this.igChanging.emit(true);
  }

  public getDependsOnName(dependsOn: ImplementationGuideDependsOnComponent) {
    const extension = (dependsOn.extension || []).find((ext) => ext.url === Globals.extensionUrls['ig-depends-on-name']);

    if (extension) {
      return extension.valueString;
    }
  }

  public addParameter() {
    if (!this.implementationGuide.definition) {
      this.implementationGuide.definition = {
        resource: []
      };
    }

    this.implementationGuide.definition.parameter = this.implementationGuide.definition.parameter || [];
    this.implementationGuide.definition.parameter.push({ code: '', value: '' });
  }

  public addGlobal() {
    this.implementationGuide.global = this.implementationGuide.global || [];
    this.implementationGuide.global.push({type: '', profile: '' });
  }

  public setDependsOnName(dependsOn: ImplementationGuideDependsOnComponent, name: any) {
    if (!dependsOn.extension) {
      dependsOn.extension = [];
    }

    let extension = (dependsOn.extension || []).find((ext) => ext.url === Globals.extensionUrls['ig-depends-on-name']);

    if (!extension && name) {
      extension = <Extension>{
        url: Globals.extensionUrls['ig-depends-on-name'],
        valueString: <string>name
      };
      dependsOn.extension.push(extension);
    } else if (extension && !name) {
      const index = dependsOn.extension.indexOf(extension);
      dependsOn.extension.splice(index, 1);
    } else if (extension && name) {
      extension.valueString = <string>name;
    }
  }

  public getDependsOnLocation(dependsOn: ImplementationGuideDependsOnComponent) {
    const extension = (dependsOn.extension || []).find((ext) => ext.url === Globals.extensionUrls['ig-depends-on-location']);

    if (extension) {
      return extension.valueString;
    }
  }

  public setDependsOnLocation(dependsOn: ImplementationGuideDependsOnComponent, location: any) {
    if (!dependsOn.extension) {
      dependsOn.extension = [];
    }

    let extension = (dependsOn.extension || []).find((ext) => ext.url === Globals.extensionUrls['ig-depends-on-location']);

    if (!extension && location) {
      extension = <Extension>{
        url: Globals.extensionUrls['ig-depends-on-location'],
        valueString: <string>location
      };
      dependsOn.extension.push(extension);
    } else if (extension && !location) {
      const index = dependsOn.extension.indexOf(extension);
      dependsOn.extension.splice(index, 1);
    } else if (extension && location) {
      extension.valueString = <string>location;
    }
  }

  public save() {

    // Add the new fhir version if they forgot to click the + button
    if (this.newFhirVersion && this.implementationGuide.fhirVersion) {
      this.implementationGuide.fhirVersion.push(this.newFhirVersion);
    }

    if (!this.validation.valid && !confirm('This implementation guide is not valid, are you sure you want to save?')) {
      return;
    }

    if (this.isFile) {
      this.fileService.saveFile();
      this.igChanging.emit(false);
      return;
    }

    this.implementationGuideService.saveImplementationGuide(this.implementationGuide)
      .subscribe((implementationGuide: ImplementationGuide) => {
        if (this.isNew) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.fhirServer}/${implementationGuide.id}/implementation-guide`]);
        } else {
          // Copy the new permissions to the context so that we other resources create for the ig will adopt the new permissions
          if (this.configService.project && this.configService.project.implementationGuideId === implementationGuide.id) {
            // only if the updated implementation guide has security tags
            if (implementationGuide.meta && implementationGuide.meta.security && implementationGuide.meta.security.length > 0) {
              this.configService.project.securityTags = implementationGuide.meta.security;
            }
          }

          this.message = 'Your changes have been saved!';
          this.igChanging.emit(false);
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      }, (err) => {
        this.message = 'An error occurred while saving the implementation guide: ' + getErrorString(err);
      });
  }

  private initPage(page: ImplementationGuidePageComponent, level = 0, parent?: ImplementationGuidePageComponent) {
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

    if (this.implementationGuide.definition) {
      this.initPage(this.implementationGuide.definition.page);
    }

    // Since the PageDefinitions have changed, we need to reset the selected page
    if (this.selectedPage) {
      this.selectedPage = this.pages.find(p => p.page === this.selectedPage.page);
    }
  }

  ngOnInit() {
    this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.getImplementationGuide();

    // Watch the route parameters to see if the id of the implementation guide changes. Reload if it does.
    this.route.params.subscribe((params) => {
      if (params.implementationGuideId && this.implementationGuide && params.implementationGuideId !== this.implementationGuide.id) {
        this.getImplementationGuide();
      }
    });
  }

  public canDeactivate(): boolean{
    return !this.isDirty;
  }

  ngOnDestroy() {
    this.configService.setTitle(null);
  }

  ngDoCheck() {
    if (this.implementationGuide) {
      this.validation = this.fhirService.validate(this.implementationGuide);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {  // right
    if (this.selectedPage) {
      if (event.altKey && !event.ctrlKey) {
        if (this.selectedPage.page === this.implementationGuide.definition.page && event.code === 'ArrowDown') {
          // Current page is root page and the user wants to navigate down
          if (this.selectedPage.page.page && this.selectedPage.page.page.length > 0) {
            // If the current page is the root page and there are child pages, select the first child
            this.selectedPage = this.pages.find(p => p.page === this.selectedPage.page.page[0]);
          }
        } else {
          const index = this.selectedPage.parent.page.indexOf(this.selectedPage.page);

          if (event.code === 'ArrowUp') {
            if (index > 0) {
              // Select the previous sibling up
              let previousPage = this.selectedPage.parent.page[index - 1];

              if (previousPage.page && previousPage.page.length > 0) {
                // Find the last leaf of the previous sibling
                while (previousPage.page && previousPage.page.length > 0) {
                  previousPage = previousPage.page[previousPage.page.length - 1];
                }
              }

              this.selectedPage = this.pages.find(p => p.page === previousPage);
            } else if (index === 0) {
              // Select the parent
              this.selectedPage = this.pages.find(p => p.page === this.selectedPage.parent);
            }
          } else if (event.code === 'ArrowDown') {
            if (this.selectedPage.page.page && this.selectedPage.page.page.length > 0) {
              // Select the first child
              this.selectedPage = this.pages.find(p => p.page === this.selectedPage.page.page[0]);
            } else if (this.selectedPage.parent.page.length > index + 1) {
              // Select the next sibling down
              this.selectedPage = this.pages.find(p => p.page === this.selectedPage.parent.page[index + 1]);
            } else {
              const findNextParentSibling = (nextParent: ImplementationGuidePageComponent) => {
                const parentPageDef = this.pages.find(p => p.page === nextParent);

                if (parentPageDef.parent) {
                  const parentIndex = parentPageDef.parent.page.indexOf(parentPageDef.page);

                  if (parentPageDef.parent.page.length > parentIndex + 1) {
                    // Select the parent page's next sibling
                    return parentPageDef.parent.page[parentIndex + 1];
                  } else {
                    return findNextParentSibling(parentPageDef.parent);
                  }
                }
              };

              const foundNextParentSibling = findNextParentSibling(this.selectedPage.parent);

              if (foundNextParentSibling) {
                this.selectedPage = this.pages.find(p => p.page === foundNextParentSibling);
              }
            }
          }
        }
      } else if (event.altKey && event.ctrlKey) {
        switch (event.code) {
          case 'ArrowRight':
            this.movePageIn(this.selectedPage);
            break;
          case 'ArrowLeft':
            this.movePageOut(this.selectedPage);
            break;
          case 'ArrowUp':
            this.movePageUp(this.selectedPage);
            break;
          case 'ArrowDown':
            this.movePageDown(this.selectedPage);
            break;
        }
      }
    }
  }
}
