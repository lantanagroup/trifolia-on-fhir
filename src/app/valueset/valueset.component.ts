import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {ConceptSetComponent, ValueSet} from '../models/fhir';
import {Globals} from '../globals';
import {RecentItemService} from '../services/recent-item.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ValueSetService} from '../services/value-set.service';
import {Observable} from 'rxjs/Observable';
import * as _ from 'underscore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirEditValuesetIncludeModalComponent} from '../fhir-edit/valueset-include-modal/valueset-include-modal.component';
import {FhirService} from '../services/fhir.service';

@Component({
    selector: 'app-valueset',
    templateUrl: './valueset.component.html',
    styleUrls: ['./valueset.component.css'],
    providers: [FhirService]
})
export class ValuesetComponent implements OnInit, DoCheck {
    @Input() public valueSet = new ValueSet();
    public message: string;
    public validation: any;

    constructor(
        public globals: Globals,
        private valueSetService: ValueSetService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private recentItemService: RecentItemService,
        private fhirService: FhirService) {
    }

    public save() {
        if (!this.validation.valid && !confirm('This value set is not valid, are you sure you want to save?')) {
            return;
        }

        this.valueSetService.save(this.valueSet)
            .subscribe((results: ValueSet) => {
                if (!this.valueSet.id) {
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

    public editInclude(include: ConceptSetComponent) {
        const ref = this.modalService.open(FhirEditValuesetIncludeModalComponent, { size: 'lg' });
        ref.componentInstance.include = include;
    }

    private getValueSet(): Observable<ValueSet> {
        const valueSetId  = this.route.snapshot.paramMap.get('id');

        return new Observable<ValueSet>((observer) => {
            if (valueSetId) {
                this.valueSetService.get(valueSetId)
                    .subscribe((vs) => {
                        this.valueSet = vs;
                        observer.next(vs);
                    }, (err) => {
                        observer.error(err);
                    });
            }
        });
    }

    ngOnInit() {
        this.getValueSet()
            .subscribe((vs) => {
                this.recentItemService.ensureRecentItem(
                    this.globals.cookieKeys.recentValueSets,
                    vs.id,
                    vs.name || vs.title);
            });
    }

    ngDoCheck() {
        this.validation = this.fhirService.validate(this.valueSet);
    }
}
