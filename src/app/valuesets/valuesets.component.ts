import {Component, OnInit} from '@angular/core';
import {ValueSetService} from '../services/value-set.service';
import {Bundle, DomainResource, Resource, ValueSet} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-valuesets',
    templateUrl: './valuesets.component.html',
    styleUrls: ['./valuesets.component.css']
})
export class ValuesetsComponent implements OnInit {
    public results: Bundle;
    public nameText: string;
    public page = 1;
    public urlText: string;
    public criteriaChangedEvent = new Subject();
    public totalPages = 1;
    public message: string;

    constructor(
        private valueSetService: ValueSetService,
        private modalService: NgbModal) {

        this.criteriaChangedEvent
            .debounceTime(500)
            .subscribe(() => {
                this.getValueSets();
            });
    }

    public get valueSets() {
        if (!this.results) {
            return [];
        }

        return _.map(this.results.entry, (entry) => <ValueSet> entry.resource);
    }

    public clearFilters() {
        this.nameText = null;
        this.urlText = null;
        this.page = 1;
        this.criteriaChanged();
    }

    public remove(valueSet: ValueSet) {
        if (!confirm(`Are you sure you want to delete the value set ${valueSet.title || valueSet.name || 'no-name'}`)) {
            return;
        }

        this.valueSetService.delete(valueSet.id)
            .subscribe(() => {
                this.message = `Successfully deleted value set ${valueSet.title || valueSet.name || 'no-name'} (${valueSet.id})`;
                const entry = _.find(this.results.entry, (entry) => entry.resource.id === valueSet.id);
                const index = this.results.entry.indexOf(entry);
                this.results.entry.splice(index, 1);
                setTimeout(() => this.message = '', 3000);
            }, (err) => {
                this.message = err;
            });
    }

    public criteriaChanged() {
        this.criteriaChangedEvent.next();
    }

    public nameTextChanged(value: string) {
        this.nameText = value;
        this.page = 1;
        this.criteriaChanged();
    }

    public urlTextChanged(value: string) {
        this.urlText = value;
        this.page = 1;
        this.criteriaChanged();
    }

    public changeId(valueSet: ValueSet) {
        const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
        modalRef.componentInstance.resourceType = valueSet.resourceType;
        modalRef.componentInstance.originalId = valueSet.id;
        modalRef.result.then((newId) => {
            valueSet.id = newId;
        });
    }

    public getValueSets() {
        this.results = null;
        this.message = 'Searching value sets...';

        this.valueSetService.search(this.page, this.nameText, this.urlText)
            .subscribe((results: Bundle) => {
                this.results = results;
                this.totalPages = results && results.total ? Math.ceil(results.total / 8) : 0;
                this.message = '';
            });
    }

    ngOnInit() {
        this.getValueSets();
    }
}
