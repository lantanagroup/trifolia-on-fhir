import {Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
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
} from '../../models/r4/fhir';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ImplementationGuideService, PublishedGuideModel} from '../../services/implementation-guide.service';
import {Globals} from '../../globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
import {PageComponentModalComponent} from './page-component-modal.component';
import {RecentItemService} from '../../services/recent-item.service';
import {FhirService} from '../../services/fhir.service';
import {FileService} from '../../services/file.service';
import {ConfigService} from '../../services/config.service';
import {PublishedIgSelectModalComponent} from '../../published-ig-select-modal/published-ig-select-modal.component';
import {FhirReferenceModalComponent, ResourceSelection} from '../../fhir-edit/reference-modal/reference-modal.component';

class PageDefinition {
    public page: ImplementationGuidePageComponent;
    public parent?: ImplementationGuidePageComponent;
    public level: number;
}

@Component({
    templateUrl: './implementation-guide.component.html',
    styleUrls: ['./implementation-guide.component.css']
})
export class R4ImplementationGuideComponent implements OnInit, OnDestroy, DoCheck {
    public implementationGuide = this.isNew ? new ImplementationGuide() : undefined;
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
    private navSubscription: any;

    constructor(
        private modal: NgbModal,
        private router: Router,
        private implementationGuideService: ImplementationGuideService,
        private authService: AuthService,
        private configService: ConfigService,
        private recentItemService: RecentItemService,
        private fileService: FileService,
        private fhirService: FhirService,
        public globals: Globals,
        public route: ActivatedRoute) {
    }

    public get resources(): ImplementationGuideResourceComponent[] {
        if (!this.implementationGuide.definition) {
            return [];
        }

        const profileTypes = ['StructureDefinition', 'CapabilityStatement', 'OperationDefinition', 'ImplementationGuide', 'SearchParameter'];
        const terminologyTypes = ['ValueSet', 'CodeSystem', 'ConceptMap'];

        return _.chain(this.implementationGuide.definition.resource)
            .filter((resource: ImplementationGuideResourceComponent) => {
                if (!resource.reference || !resource.reference.reference) {
                    return true;
                }

                const parsedReference = this.fhirService.parseReference(resource.reference.reference);

                if (this.filterResourceType.profile && profileTypes.indexOf(parsedReference.resourceType) >= 0) {
                    return true;
                }

                if (this.filterResourceType.terminology && terminologyTypes.indexOf(parsedReference.resourceType) >= 0) {
                    return true;
                }

                if (this.filterResourceType.example && profileTypes.concat(terminologyTypes).indexOf(parsedReference.resourceType) < 0) {
                    return true;
                }

                return false;
            })
            .filter((resource: ImplementationGuideResourceComponent) => {
                if (!this.filterResourceQuery) {
                    return true;
                }

                const reference = resource.reference && resource.reference.reference ?
                    resource.reference.reference.toLowerCase().trim() :
                    '';
                const name = resource.name ?
                    resource.name.toLowerCase().trim() :
                    '';

                return reference.indexOf(this.filterResourceQuery.toLowerCase().trim()) >= 0;
            })
            .value();
    }

    public get isNew(): boolean {
        const id  = this.route.snapshot.paramMap.get('id');
        return !id || id === 'new';
    }

    public get isFilterResourceTypeAll() {
        return this.filterResourceType.profile && this.filterResourceType.terminology && this.filterResourceType.example;
    }

    public addResources() {
        const modalRef = this.modal.open(FhirReferenceModalComponent, { size: 'lg' });
        modalRef.componentInstance.selectMultiple = true;

        modalRef.result.then((results: ResourceSelection[]) => {
            if (!this.implementationGuide.definition) {
                this.implementationGuide.definition = new ImplementationGuideDefinitionComponent();
                this.implementationGuide.definition.resource = [];
            }

            const allProfilingTypes = this.fhirService.profileTypes.concat(this.fhirService.terminologyTypes);

            _.each(results, (result: ResourceSelection) => {
                this.implementationGuide.definition.resource.push({
                    reference: {
                        reference: result.resourceType + '/' + result.id,
                        display: result.display
                    },
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

        const found = _.filter(this.implementationGuide.definition.resource, (next: ImplementationGuideResourceComponent) =>
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
        const modalRef = this.modal.open(PublishedIgSelectModalComponent, { size: 'lg' });
        modalRef.result.then((guide: PublishedGuideModel) => {
            dependsOn.packageId = guide['npm-name'];
            dependsOn.uri = guide.url;
            dependsOn.version = guide.version;
        });
    }

    public revert() {
        this.getImplementationGuide();
    }

    private getImplementationGuide() {
        const implementationGuideId = this.route.snapshot.paramMap.get('id');

        if (implementationGuideId === 'from-file') {
            if (this.fileService.file) {
                this.implementationGuide = <ImplementationGuide> this.fileService.file.resource;
                this.nameChanged();
                this.initPages();
            } else {
                this.router.navigate(['/']);
                return;
            }
        }

        if (implementationGuideId !== 'new' && implementationGuideId) {
            this.implementationGuide = null;

            this.implementationGuideService.getImplementationGuide(implementationGuideId)
                .subscribe((results: ImplementationGuide | OperationOutcome) => {
                    if (results.resourceType !== 'ImplementationGuide') {
                        this.message = 'The specified implementation guide either does not exist or was deleted';
                        return;
                    }

                    this.implementationGuide = <ImplementationGuide> results;
                    this.nameChanged();
                    this.initPages();
                    this.recentItemService.ensureRecentItem(
                        this.globals.cookieKeys.recentImplementationGuides,
                        this.implementationGuide.id,
                        this.implementationGuide.name);
                }, (err) => {
                    this.igNotFound = err.status === 404;
                    this.message = err && err.message ? err.message : 'Error loading implementation guide';
                    this.recentItemService.removeRecentItem(this.globals.cookieKeys.recentImplementationGuides, implementationGuideId);
                });
        }
    }

    public tabChange(event) {
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
            const newPage = new ImplementationGuidePageComponent();
            newPage.title = 'Table of Contents';
            newPage.generation = 'generated';
            newPage.nameUrl = 'toc.md';

            newPage.extension = [{
                url: this.globals.extensionIgPageAutoGenerateToc,
                valueBoolean: true
            }];

            this.implementationGuide.definition.page = newPage;
        } else if (!value && this.implementationGuide.definition.page) {
            const foundPageDef = _.find(this.pages, (pageDef) => pageDef.page === this.implementationGuide.definition.page);
            this.removePage(foundPageDef);
        }

        this.initPages();
    }

    public editPage(pageDef: PageDefinition) {
        const modalRef = this.modal.open(PageComponentModalComponent, { size: 'lg' });
        modalRef.componentInstance.implementationGuide = this.implementationGuide;
        modalRef.componentInstance.page = pageDef.page;

        if (this.implementationGuide.definition.page === pageDef.page) {
            modalRef.componentInstance.rootPage = true;
        }
    }

    private getNewPageTitles(next = this.implementationGuide.definition.page, pageTitles: string[] = []) {
        if (next.title && next.title.match(/New Page( \d+)?/)) {
            pageTitles.push(next.title);
        }

        _.each(next.page, (childPage) => this.getNewPageTitles(childPage, pageTitles));

        return pageTitles;
    }

    private getNewPageTitle() {
        const titles = this.getNewPageTitles();
        return 'New Page ' + (titles.length + 1).toString();
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
        newBinary.data = btoa('No page content yet');
        newBinary.id = this.globals.generateRandomNumber(5000, 10000).toString();
        this.implementationGuide.contained.push(newBinary);

        const newPage = new ImplementationGuidePageComponent();
        newPage.title = this.getNewPageTitle();
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
                const foundChildPageDef = _.find(this.pages, (nextPageDef) => nextPageDef.page === childPage);
                this.removePage(foundChildPageDef);
            }
        }

        // If a contained Binary resource is associated with the page, remove it
        if (pageDef.page.nameReference) {
            if (pageDef.page.nameReference.reference && pageDef.page.nameReference.reference.startsWith('#')) {
                const foundBinary = _.find(this.implementationGuide.contained, (contained) =>
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
        const extension = _.find(dependsOn.extension, (extension) => extension.url === this.globals.extensionUrls['ig-depends-on-name']);

        if (extension) {
            return extension.valueString;
        }
    }

    public setDependsOnName(dependsOn: ImplementationGuideDependsOnComponent, name: any) {
        if (!dependsOn.extension) {
            dependsOn.extension = [];
        }

        let extension = _.find(dependsOn.extension, (extension) => extension.url === this.globals.extensionUrls['ig-depends-on-name']);

        if (!extension && name) {
            extension = <Extension> {
                url: this.globals.extensionUrls['ig-depends-on-name'],
                valueString: <string> name
            };
            dependsOn.extension.push(extension);
        } else if (extension && !name) {
            const index = dependsOn.extension.indexOf(extension);
            dependsOn.extension.splice(index, 1);
        } else if (extension && name) {
            extension.valueString = <string> name;
        }
    }

    public getDependsOnLocation(dependsOn: ImplementationGuideDependsOnComponent) {
        const extension = _.find(dependsOn.extension, (extension) => extension.url === this.globals.extensionUrls['ig-depends-on-location']);

        if (extension) {
            return extension.valueString;
        }
    }

    public setDependsOnLocation(dependsOn: ImplementationGuideDependsOnComponent, location: any) {
        if (!dependsOn.extension) {
            dependsOn.extension = [];
        }

        let extension = _.find(dependsOn.extension, (extension) => extension.url === this.globals.extensionUrls['ig-depends-on-location']);

        if (!extension && location) {
            extension = <Extension> {
                url: this.globals.extensionUrls['ig-depends-on-location'],
                valueString: <string> location
            };
            dependsOn.extension.push(extension);
        } else if (extension && !location) {
            const index = dependsOn.extension.indexOf(extension);
            dependsOn.extension.splice(index, 1);
        } else if (extension && location) {
            extension.valueString = <string> location;
        }
    }

    public save() {
        const implementationGuideId = this.route.snapshot.paramMap.get('id');

        if (!this.validation.valid && !confirm('This implementation guide is not valid, are you sure you want to save?')) {
            return;
        }

        if (implementationGuideId === 'from-file') {
            this.fileService.saveFile();
            return;
        }

        this.implementationGuideService.saveImplementationGuide(this.implementationGuide)
            .subscribe((results: ImplementationGuide) => {
                if (this.isNew) {
                    this.router.navigate(['/implementation-guide/' + results.id]);
                } else {
                    this.recentItemService.ensureRecentItem(this.globals.cookieKeys.recentImplementationGuides, results.id, results.name);
                    this.message = 'Your changes have been saved!';
                    setTimeout(() => { this.message = ''; }, 3000);
                }
            }, (err) => {
                this.message = 'An error occured while saving the implementation guide: ' + this.fhirService.getErrorString(err);
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
        this.navSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd && e.url.startsWith('/implementation-guide/')) {
                this.getImplementationGuide();
            }
        });
        this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
        this.getImplementationGuide();
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