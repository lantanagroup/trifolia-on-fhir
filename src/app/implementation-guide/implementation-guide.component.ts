import {Component, DoCheck, Input, OnDestroy, OnInit, SimpleChange} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Binary, ImplementationGuide, PageComponent} from '../models/stu3/fhir';
import {ActivatedRoute, Router} from '@angular/router';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {Observable} from 'rxjs/Observable';
import {Globals} from '../globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
import {PageComponentModalComponent} from '../fhir-edit/page-component-modal/page-component-modal.component';
import {RecentItemService} from '../services/recent-item.service';
import {BinaryService} from '../services/binary.service';
import {FhirService} from '../services/fhir.service';

class PageDefinition {
    public page: PageComponent;
    public parent?: PageComponent;
    public level: number;
}

@Component({
    selector: 'app-implementation-guide',
    templateUrl: './implementation-guide.component.html',
    styleUrls: ['./implementation-guide.component.css'],
    providers: [ImplementationGuideService, FhirService]
})
export class ImplementationGuideComponent implements OnInit, DoCheck, OnDestroy {
    @Input() public implementationGuide?: ImplementationGuide;
    public message: string;
    public currentResource: any;
    public validation: any;
    public pages: PageDefinition[];
    private unsavedBinaryAssociations: string[] = [];

    constructor(
        private modal: NgbModal,
        private route: ActivatedRoute,
        private router: Router,
        private implementationGuideService: ImplementationGuideService,
        private authService: AuthService,
        private recentItemService: RecentItemService,
        private binaryService: BinaryService,
        public globals: Globals,
        private fhirService: FhirService) {
    }

    private getImplementationGuide(): Observable<ImplementationGuide> {
        const implementationGuideId = this.route.snapshot.paramMap.get('id');

        return new Observable((observer) => {
            if (implementationGuideId) {
                this.implementationGuideService.getImplementationGuide(implementationGuideId)
                    .subscribe((results: ImplementationGuide) => {
                        this.implementationGuide = results;
                        this.initPages();
                        observer.next(results);
                    }, (err) => {
                        observer.error(err);
                    });
            } else {
                this.implementationGuide = new ImplementationGuide();
                observer.next(this.implementationGuide);
            }
        });
    }

    public getResourceSourceType(resource) {
        if (resource.hasOwnProperty('sourceUri')) {
            return 'uri';
        } else if (resource.hasOwnProperty('sourceReference')) {
            return 'reference';
        }
    }

    public openPackageResourceModal(resource, content) {
        this.currentResource = resource;
        this.modal.open(content);
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

            const newPage = new PageComponent();
            const newBinary = new Binary();
            newBinary.contentType = 'text/plain';
            newBinary.content = btoa('No page content yet');
            newBinary.id = this.globals.generateRandomNumber(5000, 10000).toString();

            if (!this.implementationGuide.contained) {
                this.implementationGuide.contained = [];
            }

            this.implementationGuide.contained.push(newBinary);

            this.implementationGuide.page.source = '#' + newBinary.id;
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
        if (!pageDef.page.page) {
            pageDef.page.page = [];
        }

        const newPage = new PageComponent();
        const newBinary = new Binary();
        newBinary.contentType = 'text/markdown';
        newBinary.content = btoa('No page content yet');

        if (!this.implementationGuide.contained) {
            this.implementationGuide.contained = [];
        }

        if (this.globals.pageAsContainedBinary) {
            newBinary.id = this.globals.generateRandomNumber(5000, 10000).toString();
            this.implementationGuide.contained.push(newBinary);

            newPage.source = '#' + newBinary.id;
            pageDef.page.page.push(newPage);

            this.initPages();
        } else {
            this.binaryService.save(newBinary)
                .subscribe((results) => {
                    newPage.source = 'Binary/' + results.id;
                    pageDef.page.page.push(newPage);

                    this.unsavedBinaryAssociations.push(results.id);
                    this.initPages();
                }, (err) => {

                });
        }
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
            } else if (parsedSourceUrl && parsedSourceUrl.resourceType === 'Binary') {
                this.binaryService.delete(parsedSourceUrl.id)      // Async call that we don't have to wait on
                    .subscribe(() => {
                        // Remove the id from the list of unsaved binary associations
                        const unsavedIndex = this.unsavedBinaryAssociations.indexOf(parsedSourceUrl.id);
                        if (unsavedIndex >= 0) {
                            this.unsavedBinaryAssociations.splice(unsavedIndex, 1);
                        }
                    }, (err) => {
                        alert('Error deleting Binary resource associated with page');
                        console.log('Error deleting Binary resource associated with page: ' + err);
                    });
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
                this.message = 'An error occured while saving the implementation guide';
            });
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
        this.getImplementationGuide()
            .subscribe((ig) => {
                this.recentItemService.ensureRecentItem(
                    this.globals.cookieKeys.recentImplementationGuides,
                    this.implementationGuide.id,
                    this.implementationGuide.name);
            });
    }

    ngDoCheck() {
        this.validation = this.fhirService.validate(this.implementationGuide);
    }

    ngOnDestroy() {
        // Remove any Binary resources that were created for pages, but whose page was not saved in the IG
        _.each(this.unsavedBinaryAssociations, (id) => this.binaryService.delete(id));
    }
}
