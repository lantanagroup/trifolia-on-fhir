import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/auth.service';
import {
  Binary,
  Coding,
  ImplementationGuide,
  OperationOutcome,
  ImplementationGuidePageComponent,
  ResourceReference,
  ImplementationGuideDefinitionComponent,
  ImplementationGuidePackageComponent,
  ImplementationGuideResourceComponent,
  ImplementationGuideDependsOnComponent, Extension
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
import {BaseComponent} from '../../base.component';
import { getErrorString, parseReference } from '../../../../../../libs/tof-lib/src/lib/helper';
import {R4ResourceModalComponent} from './resource-modal.component';
import {
  getDefaultImplementationGuideResourcePath,
  getImplementationGuideMediaReferences, MediaReference
} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {ChangeResourceIdModalComponent} from '../../modals/change-resource-id-modal/change-resource-id-modal.component';

class PageDefinition {
  public page: ImplementationGuidePageComponent;
  public parent?: ImplementationGuidePageComponent;
  public level: number;
}

@Component({
  templateUrl: './implementation-guide.component.html',
  styleUrls: ['./implementation-guide.component.css']
})
export class R4ImplementationGuideComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  public implementationGuide: ImplementationGuide;
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
  public Globals = Globals;

  constructor(
    private modal: NgbModal,
    private router: Router,
    private implementationGuideService: ImplementationGuideService,
    private fileService: FileService,
    private fhirService: FhirService,
    protected authService: AuthService,
    public configService: ConfigService,
    public route: ActivatedRoute) {

    super(configService, authService);

    this.implementationGuide = new ImplementationGuide({ meta: this.authService.getDefaultMeta() });
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

  public get isFilterResourceTypeAll() {
    return this.filterResourceType.profile && this.filterResourceType.terminology && this.filterResourceType.example;
  }

  public editResource(resource: ImplementationGuideResourceComponent) {
    const modalRef = this.modal.open(R4ResourceModalComponent, { size: 'lg' });
    modalRef.componentInstance.resource = resource;
    modalRef.componentInstance.implementationGuide = this.implementationGuide;
  }

  public changeId() {
    if (!confirm('Any changes to the implementation guide that are not saved will be lost. Continue?')) {
      return;
    }

    const modalRef = this.modal.open(ChangeResourceIdModalComponent, { size: 'lg' });
    modalRef.componentInstance.resourceType = 'ImplementationGuide';
    modalRef.componentInstance.originalId = this.implementationGuide.id;
  }

  public addResources() {
    const modalRef = this.modal.open(FhirReferenceModalComponent, {size: 'lg'});
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

        this.implementationGuide.definition.resource.push({
          extension: [{
            url: Globals.extensionUrls['extension-ig-resource-file-path'],
            valueString: getDefaultImplementationGuideResourcePath(newReference)
          }],
          reference: newReference,
          name: result.display,
          exampleBoolean: allProfilingTypes.indexOf(result.resourceType) < 0
        });
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
    const modalRef = this.modal.open(PublishedIgSelectModalComponent, {size: 'lg'});
    modalRef.result.then((guide: PublishedGuideModel) => {
      dependsOn.packageId = guide['npm-name'];
      dependsOn.uri = guide.url;
      dependsOn.version = guide.version;
    });
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

  public togglePackages(hasPackages: boolean) {
    if (!hasPackages && this.implementationGuide.definition && this.implementationGuide.definition.package) {
      delete this.implementationGuide.definition.package;
    } else if (hasPackages) {
      if (!this.implementationGuide.definition) {
        this.implementationGuide.definition = new ImplementationGuideDefinitionComponent();
      }

      if (!this.implementationGuide.definition.package) {
        this.implementationGuide.definition.package = [];
      }

      if (this.implementationGuide.definition.package.length === 0) {
        const newPackage = new ImplementationGuidePackageComponent();
        newPackage.name = 'New Package';
        this.implementationGuide.definition.package.push(newPackage);
      }
    }
  }

  public toggleRootPage(value: boolean) {
    if (value && !this.implementationGuide.definition) {
      this.implementationGuide.definition = new ImplementationGuideDefinitionComponent();
    }

    if (value && !this.implementationGuide.definition.page) {
      this.implementationGuide.definition.page = new ImplementationGuidePageComponent();
      this.implementationGuide.definition.page.title = 'Home Page';
      this.implementationGuide.definition.page.generation = 'markdown';
      this.implementationGuide.definition.page.nameUrl = 'index.md';
    } else if (!value && this.implementationGuide.definition.page) {
      const foundPageDef = this.pages.find((pageDef) => pageDef.page === this.implementationGuide.definition.page);
      this.removePage(foundPageDef);
    }

    this.initPages();
  }

  public editPage(pageDef: PageDefinition) {
    const modalRef = this.modal.open(PageComponentModalComponent, {size: 'lg'});
    const componentInstance: PageComponentModalComponent = modalRef.componentInstance;

    componentInstance.implementationGuide = this.implementationGuide;

    if (this.implementationGuide.definition.page === pageDef.page) {
      componentInstance.rootPage = true;
    }

    componentInstance.setPage(pageDef.page);
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
    if (!this.implementationGuide.contained) {
      this.implementationGuide.contained = [];
    }

    if (!pageDef.page.page) {
      pageDef.page.page = [];
    }

    const newBinary = new Binary();
    newBinary.contentType = 'text/markdown';
    newBinary.id = Globals.generateRandomNumber(5000, 10000).toString();
    this.implementationGuide.contained.push(newBinary);

    if (template === 'downloads') {
      newBinary.data = 'KipGdWxsIEltcGxlbWVudGF0aW9uIEd1aWRlKioKClRoZSBlbnRpcmUgaW1wbGVtZW50YXRpb24gZ3VpZGUgKGluY2x1ZGluZyB0aGUgSFRNTCBmaWxlcywgZGVmaW5pdGlvbnMsIHZhbGlkYXRpb24gaW5mb3JtYXRpb24sIGV0Yy4pIG1heSBiZSBkb3dubG9hZGVkIFtoZXJlXShmdWxsLWlnLnppcCkuCgoqKlZhbGlkYXRvciBQYWNrIGFuZCBEZWZpbml0aW9ucyoqCgpUaGUgdmFsaWRhdG9yLnBhY2sgZmlsZSBpcyBhIHppcCBmaWxlIHRoYXQgY29udGFpbnMgYWxsIHRoZSB2YWx1ZSBzZXRzLCBwcm9maWxlcywgZXh0ZW5zaW9ucywgbGlzdCBvZiBwYWdlcyBhbmQgdXJscyBpbiB0aGUgSUcsIGV0YyBkZWZpbmVkIGFzIHBhcnQgb2YgdGhlIHRoaXMgSW1wbGVtZW50YXRpb24gR3VpZGVzLgoKSXQgaXMgdXNlZDoKCiogYnkgdGhlIHZhbGlkYXRvciBpZiB5b3UgcmVmZXIgdG8gdGhlIElHIGRpcmVjdGx5IGJ5IGl04oCZcyBjYW5vbmljYWwgVVJMCiogYnkgdGhlIElHIHB1Ymxpc2hlciBpZiB5b3UgZGVjbGFyZSB0aGF0IG9uZSBJRyBkZXBlbmRzIG9uIGFub3RoZXIKKiBieSBhIEZISVIgc2VydmVyLCBpZiB5b3UgYWRkIHRoZSBJRyB0byBzZXJ2ZXIgbG9hZCBsaXN0CgpZb3UgbWF5IFtkb3dubG9hZCB0aGUgdmFsaWRhdG9yLnBhY2tdKHZhbGlkYXRvci5wYWNrKSBmaWxlIGhlcmUuCgpJbiBhZGRpdGlvbiB0aGVyZSBhcmUgZm9ybWF0IHNwZWNpZmljIGRlZmluaXRpb25zIGZpbGVzLgoKKiBbWE1MXShkZWZpbml0aW9ucy54bWwuemlwKQoqIFtKU09OXShkZWZpbml0aW9ucy5qc29uLnppcCkKKiBbVFRMXShkZWZpbml0aW9ucy50dGwuemlwKQoKKipFeGFtcGxlczoqKiBhbGwgdGhlIGV4YW1wbGVzIHRoYXQgYXJlIHVzZWQgaW4gdGhpcyBJbXBsZW1lbnRhdGlvbiBHdWlkZSBhdmFpbGFibGUgZm9yIGRvd25sb2FkOgoKKiBbWE1MXShleGFtcGxlcy54bWwuemlwKQoqIFtKU09OXShleGFtcGxlcy5qc29uLnppcCkKKiBbVFRsXShleGFtcGxlcy50dGwuemlwKQ==';
    } else {
      newBinary.data = btoa('No page content yet');
    }

    const newPage = new ImplementationGuidePageComponent();

    if (template === 'downloads') {
      newPage.title = 'Downloads';
      newPage.extension = newPage.extension || [];
      const extension = (newPage.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);

      if (!extension) {
        newPage.extension.push(new Extension({ url: Globals.extensionUrls['extension-ig-page-nav-menu'], valueString: 'Downloads' }));
      }
    } else {
      newPage.title = this.getNewPageTitle();
    }

    newPage.generation = 'markdown';
    newPage.nameReference = new ResourceReference();
    newPage.nameReference.reference = '#' + newBinary.id;
    newPage.nameReference.display = `Page content ${newBinary.id}`;
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
    if (pageDef.page.nameReference) {
      if (pageDef.page.nameReference.reference && pageDef.page.nameReference.reference.startsWith('#')) {
        const foundBinary = (this.implementationGuide.contained || []).find((contained) =>
          contained.id === pageDef.page.nameReference.reference.substring(1));

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
      delete this.implementationGuide.definition.page;
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

  public getDependsOnName(dependsOn: ImplementationGuideDependsOnComponent) {
    const extension = (dependsOn.extension || []).find((ext) => ext.url === Globals.extensionUrls['ig-depends-on-name']);

    if (extension) {
      return extension.valueString;
    }
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

  nameChanged() {
    this.configService.setTitle(`ImplementationGuide - ${this.implementationGuide.name || 'no-name'}`);
  }

  ngOnDestroy() {
    this.configService.setTitle(null);
  }

  ngDoCheck() {
    if (this.implementationGuide) {
      this.validation = this.fhirService.validate(this.implementationGuide);
    }
  }
}
