import {Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {ConceptSetComponent, OperationOutcome, ValueSet} from '../models/stu3/fhir';
import {Globals} from '../globals';
import {RecentItemService} from '../services/recent-item.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ValueSetService} from '../services/value-set.service';
import * as _ from 'underscore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../services/fhir.service';
import {FileService} from '../services/file.service';
import {ConfigService} from '../services/config.service';

@Component({
    selector: 'app-valueset',
    templateUrl: './valueset.component.html',
    styleUrls: ['./valueset.component.css']
})
export class ValuesetComponent implements OnInit, OnDestroy, DoCheck {
    @Input() public valueSet = new ValueSet();
    public message: string;
    public validation: any;
    private navSubscription: any;

    constructor(
        public globals: Globals,
        private valueSetService: ValueSetService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private configService: ConfigService,
        private recentItemService: RecentItemService,
        private fileService: FileService,
        private fhirService: FhirService) {
    }

    public get isNew(): boolean {
        const id  = this.route.snapshot.paramMap.get('id');
        return !id || id === 'new';
    }

    public addIncludeEntry(includeTabSet) {
        this.valueSet.compose.include.push({ });
        setTimeout(() => {
            const lastIndex = this.valueSet.compose.include.length - 1;
            const newIncludeTabId = 'include-' + lastIndex.toString();
            includeTabSet.select(newIncludeTabId);
        }, 50);
    }

    public revert() {
        this.getValueSet();
    }

    public save() {
        const valueSetId = this.route.snapshot.paramMap.get('id');

        if (!this.validation.valid && !confirm('This value set is not valid, are you sure you want to save?')) {
            return;
        }

        if (valueSetId === 'from-file') {
            this.fileService.saveFile();
            return;
        }

        this.valueSetService.save(this.valueSet)
            .subscribe((results: ValueSet) => {
                if (this.isNew) {
                    this.router.navigate(['/value-set/' + results.id]);
                } else {
                    this.recentItemService.ensureRecentItem(this.globals.cookieKeys.recentValueSets, results.id, results.name);
                    this.message = 'Successfully saved value set!';
                    setTimeout(() => { this.message = ''; }, 3000);
                }
            }, (err) => {
                this.message = 'An error occured while saving the value set';
            });
    }

    public getIncludeCodes(include: ConceptSetComponent) {
        const concepts = _.map(include.concept, (concept) => concept.display || concept.code);
        const ret = concepts.join(', ');

        if (ret.length > 50) {
            return ret.substring(0, 50) + '...';
        }

        return ret;
    }

    private getValueSet() {
        const valueSetId  = this.route.snapshot.paramMap.get('id');

        if (valueSetId === 'from-file') {
            if (this.fileService.file) {
                this.valueSet = <ValueSet> this.fileService.file.resource;
                this.nameChanged();
            } else {
                this.router.navigate(['/']);
                return;
            }
        }

        if (valueSetId !== 'new' && valueSetId) {
            this.valueSet = null;

            this.valueSetService.get(valueSetId)
                .subscribe((results: ValueSet|OperationOutcome) => {
                    if (results.resourceType !== 'ValueSet') {
                        this.message = 'The specified value set either does not exist or was deleted';
                        return;
                    }

                    this.valueSet = <ValueSet> results;
                    this.nameChanged();
                    this.recentItemService.ensureRecentItem(
                        this.globals.cookieKeys.recentValueSets,
                        this.valueSet.id,
                        this.valueSet.name || this.valueSet.title);
                }, (err) => {
                    this.message = err && err.message ? err.message : 'Error loading value set';
                    this.recentItemService.removeRecentItem(this.globals.cookieKeys.recentValueSets, valueSetId);
                });
        }
    }

    ngOnInit() {
        this.navSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd && e.url.startsWith('/value-set/')) {
                this.getValueSet();
            }
        });
        this.getValueSet();
    }

    ngOnDestroy() {
        this.navSubscription.unsubscribe();
        this.configService.setTitle(null);
    }

    nameChanged() {
        this.configService.setTitle(`ValueSet - ${this.valueSet.title || this.valueSet.name || 'no-name'}`);
    }

    ngDoCheck() {
        if (this.valueSet) {
            this.validation = this.fhirService.validate(this.valueSet);
        }
    }
}
