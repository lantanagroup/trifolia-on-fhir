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
    public contentText: string;
    public page = 1;
    public urlText: string;
    public criteriaChangedEvent = new Subject();
    public totalPages = 1;

    constructor(
        private valueSetService: ValueSetService,
        private modalService: NgbModal) {

        this.criteriaChangedEvent
            .debounceTime(500)
            .subscribe(() => {
                this.getValueSets();
            });
    }

    public getValueSet(resource: Resource) {
        return <ValueSet> resource;
    }

    public remove(valueSet: ValueSet) {
    }

    public nextPage() {
        this.page = this.page + 1;
        this.criteriaChanged();
    }

    public previousPage() {
        this.page = this.page - 1;
        this.criteriaChanged();
    }

    public criteriaChanged() {
        this.criteriaChangedEvent.next();
    }

    public contentTextChanged(value: string) {
        this.contentText = value;
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
        this.valueSetService.search(this.page, this.contentText, this.urlText)
            .subscribe((results: Bundle) => {
                this.results = results;
                this.totalPages = results && results.total ? Math.ceil(results.total / 8) : 0;
            });
    }

    ngOnInit() {
        this.getValueSets();
    }
}
