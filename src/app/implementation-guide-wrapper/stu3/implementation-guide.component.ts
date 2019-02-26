import {Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {
    Binary,
    Coding,
    Extension,
    ImplementationGuide,
    OperationOutcome, PackageComponent, PackageResourceComponent,
    PageComponent
} from '../../models/stu3/fhir';
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
import {ValidatorResponse} from 'fhir/validator';
import {
    FhirReferenceModalComponent,
    ResourceSelection
} from '../../fhir-edit/reference-modal/reference-modal.component';

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
export class STU3ImplementationGuideComponent implements OnInit, OnDestroy, DoCheck {
    public implementationGuide = this.isNew ? new ImplementationGuide() : undefined;
    public message: string;
    public currentResource: any;
    public validation: ValidatorResponse;
    public pages: PageDefinition[];
    public resourceTypeCodes: Coding[] = [];
    public igNotFound = false;
    private navSubscription: any;
    private resources: ImplementationGuideResource[] = [];

    constructor(
        private modal: NgbModal,
        private route: ActivatedRoute,
        private router: Router,
        private implementationGuideService: ImplementationGuideService,
        private authService: AuthService,
        private configService: ConfigService,
        private recentItemService: RecentItemService,
        private fileService: FileService,
        public globals: Globals,
        private fhirService: FhirService) {
    }

    public get isNew(): boolean {
        const id  = this.route.snapshot.paramMap.get('id');
        return !id || id === 'new';
    }

    public selectPublishedIg(dependency: Extension) {
        const modalRef = this.modal.open(PublishedIgSelectModalComponent, { size: 'lg' });
        modalRef.result.then((guide: PublishedGuideModel) => {
            this.setDependencyLocation(dependency, guide.url);
            this.setDependencyName(dependency, guide['npm-name']);
            this.setDependencyVersion(dependency, guide.version);
        });
    }

    public get dependencies(): Extension[] {
        return _.filter(this.implementationGuide.extension, (extension: Extension) => extension.url === this.globals.extensionUrls['extension-ig-dependency']);
    }

    public removeDependency(dependency: Extension) {
        const index = this.implementationGuide.extension.indexOf(dependency);
        this.implementationGuide.extension.splice(index);
    }

    public pageKindChanged(page: PageComponent) {
        let autoGenExtension = _.find(page.extension, (extension) => extension.url === this.globals.extensionIgPageAutoGenerateToc);

        if (page.kind === 'toc') {
            if (!page.extension) {
                page.extension = [];
            }

            if (autoGenExtension && !autoGenExtension.valueBoolean) {
                autoGenExtension.valueBoolean = true;
            } else if (!autoGenExtension) {
                autoGenExtension = new Extension();
                autoGenExtension.url = this.globals.extensionIgPageAutoGenerateToc;
                autoGenExtension.valueBoolean = true;
                page.extension.push(autoGenExtension);
            }
        } else if (autoGenExtension) {
            const extIndex = page.extension.indexOf(autoGenExtension);
            page.extension.splice(extIndex, 1);
        }
    }

    public addResources(destPackage?: PackageComponent) {
        const modalRef = this.modal.open(FhirReferenceModalComponent, { size: 'lg' });
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

            const allProfilingTypes = this.fhirService.profileTypes.concat(this.fhirService.terminologyTypes);

            if (!destPackage.resource) {
                destPackage.resource = [];
            }

            _.each(results, (result: ResourceSelection) => {
                let found = false;

                // Determine if the resource is already referenced in one of the packages
                _.each(this.implementationGuide.package, (next: PackageComponent) => {
                    const foundNext = _.find(next.resource, (resource: PackageResourceComponent) => {
                        if (resource.sourceReference) {
                            const parsed = this.fhirService.parseReference(resource.sourceReference.reference);
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
        newDependency.url = this.globals.extensionUrls['extension-ig-dependency'];

        this.implementationGuide.extension.push(newDependency);

        return newDependency;
    }

    public getDependencyLocation(dependency: Extension): string {
        const locationExtension = _.find(dependency.extension, (extension: Extension) => extension.url === this.globals.extensionUrls['extension-ig-dependency-location']);

        if (locationExtension) {
            return locationExtension.valueUri;
        }
    }

    public setDependencyLocation(dependency: Extension, name: string) {
        let locationExtension = _.find(dependency.extension, (extension: Extension) => extension.url === this.globals.extensionUrls['extension-ig-dependency-location']);

        if (!locationExtension) {
            locationExtension = new Extension();
            locationExtension.url = this.globals.extensionUrls['extension-ig-dependency-location'];

            if (!dependency.extension) {
                dependency.extension = [];
            }

            dependency.extension.push(locationExtension);
        }

        locationExtension.valueUri = name;
    }

    public getDependencyName(dependency: Extension): string {
        const nameExtension = _.find(dependency.extension, (extension: Extension) => extension.url === this.globals.extensionUrls['extension-ig-dependency-name']);

        if (nameExtension) {
            return nameExtension.valueString;
        }
    }

    public setDependencyName(dependency: Extension, name: string) {
        let nameExtension = _.find(dependency.extension, (extension: Extension) => extension.url === this.globals.extensionUrls['extension-ig-dependency-name']);

        if (!nameExtension) {
            nameExtension = new Extension();
            nameExtension.url = this.globals.extensionUrls['extension-ig-dependency-name'];

            if (!dependency.extension) {
                dependency.extension = [];
            }

            dependency.extension.push(nameExtension);
        }

        nameExtension.valueString = name;
    }

    public getDependencyVersion(dependency: Extension): string {
        const versionExtension = _.find(dependency.extension, (extension: Extension) => extension.url === this.globals.extensionUrls['extension-ig-dependency-version']);

        if (versionExtension) {
            return versionExtension.valueString;
        }
    }

    public setDependencyVersion(dependency: Extension, version: string) {
        let versionExtension = _.find(dependency.extension, (extension: Extension) => extension.url === this.globals.extensionUrls['extension-ig-dependency-version']);

        if (!versionExtension) {
            versionExtension = new Extension();
            versionExtension.url = this.globals.extensionUrls['extension-ig-dependency-version'];

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

    public getResourceSourceType(resource) {
        if (resource.hasOwnProperty('sourceUri')) {
            return 'uri';
        } else if (resource.hasOwnProperty('sourceReference')) {
            return 'reference';
        }
    }

    public editPackageResourceModal(resource, content) {
        this.currentResource = resource;
        this.modal.open(content, { size: 'lg' });
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
            const newPage = new PageComponent();
            newPage.kind = 'toc';
            newPage.title = 'Table of Contents';
            newPage.format = 'markdown';
            newPage.extension = [{
                url: this.globals.extensionIgPageAutoGenerateToc,
                valueBoolean: true
            }];
            newPage.source = 'toc.md';
            this.implementationGuide.page = newPage;
        } else if (!value && this.implementationGuide.page) {
            const foundPageDef = _.find(this.pages, (pageDef) => pageDef.page === this.implementationGuide.page);
            this.removePage(foundPageDef);
        }

        this.initPages();
    }

    public editPage(pageDef: PageDefinition) {
        const modalRef = this.modal.open(PageComponentModalComponent, { size: 'lg' });
        modalRef.componentInstance.implementationGuide = this.implementationGuide;
        modalRef.componentInstance.page = pageDef.page;
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
        newBinary.id = this.globals.generateRandomNumber(5000, 10000).toString();
        this.implementationGuide.contained.push(newBinary);

        const newPage = new PageComponent();
        newPage.kind = 'page';
        newPage.format = 'markdown';
        newPage.extension = [{
            url: this.globals.extensionIgPageContentUrl,
            valueReference: {
                reference: '#' + newBinary.id,
                display: `Page content ${newBinary.id}`
            }
        }];
        newPage.source = 'newPage.md';
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
        if (pageDef.page.source) {
            const parsedSourceUrl = this.globals.parseFhirUrl(pageDef.page.source);

            if (pageDef.page.source.startsWith('#')) {
                const foundBinary = _.find(this.implementationGuide.contained, (contained) =>
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
                if (!this.implementationGuide.id) {
                    this.router.navigate(['/implementation-guide/' + results.id]);
                } else {
                    this.recentItemService.ensureRecentItem(this.globals.cookieKeys.recentImplementationGuides, results.id, results.name);
                    this.message = 'Successfully saved implementation guide!';
                    setTimeout(() => { this.message = ''; }, 3000);
                }
            }, (err) => {
                this.message = 'An error occured while saving the implementation guide: ' + this.fhirService.getErrorString(err);
            });
    }

    public canEditImplementationGuideResource(igResource: ImplementationGuideResource) {
        const parsed = this.fhirService.parseReference(igResource.resource.sourceReference.reference);

        if (!parsed) {
            return false;
        }

        return parsed.id && (
            parsed.resourceType === 'ImplementationGuide' ||
                parsed.resourceType === 'StructureDefinition' ||
                parsed.resourceType === 'CapabilityStatement' ||
                parsed.resourceType === 'OperationDefinition' ||
                parsed.resourceType === 'CodeSystem' ||
                parsed.resourceType === 'ValueSet' ||
                parsed.resourceType === 'Questionnaire'
        );
    }

    public editImplementationGuideResource(igResource: ImplementationGuideResource) {
        const parsed = this.fhirService.parseReference(igResource.resource.sourceReference.reference);

        if (!confirm('This will redirect you to the "Edit Structure Definition" screen. Any unsaved changes will be lost. Are you sure you want to continue?')) {
            return;
        }

        let routeBase: string;

        switch (parsed.resourceType) {
            case 'ImplementationGuide':
                routeBase = 'implementation-guide';
                break;
            case 'StructureDefinition':
                routeBase = 'structure-definition';
                break;
            case 'CapabilityStatement':
                routeBase = 'capability-statement';
                break;
            case 'OperationDefinition':
                routeBase = 'operation-definition';
                break;
            case 'ValueSet':
                routeBase = 'value-set';
                break;
            case 'CodeSystem':
                routeBase = 'code-system';
                break;
            case 'Questionnaire':
                routeBase = 'questionnaire';
                break;
        }

        this.router.navigate([ '/' + routeBase + '/' + parsed.id ]);
    }

    public initResources() {
        this.resources = _.reduce(this.implementationGuide.package, (list, igPackage: PackageComponent) => {
            const packageResources = _.chain(igPackage.resource)
                .filter((resource: PackageResourceComponent) => {
                    return !!resource.sourceReference;
                })
                .map((resource: PackageResourceComponent) => {
                    return new ImplementationGuideResource(resource, igPackage);
                })
                .sortBy((igResource: ImplementationGuideResource) => {
                    return igResource.resource.sourceReference.reference || igResource.resource.sourceReference.display || igResource.igPackage.name;
                })
                .value();
            return list.concat(packageResources);
        }, []);
    }

    public removeResource(igResource: ImplementationGuideResource) {
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
