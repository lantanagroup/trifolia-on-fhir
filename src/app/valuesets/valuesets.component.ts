import {Component, OnInit} from '@angular/core';
import {ValueSetService} from '../services/value-set.service';
import {ValueSet} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-valuesets',
    templateUrl: './valuesets.component.html',
    styleUrls: ['./valuesets.component.css']
})
export class ValuesetsComponent implements OnInit {
    public valueSets: ValueSet[];
    public contentText: string;

    constructor(
        private valueSetService: ValueSetService,
        private modalService: NgbModal) {

    }

    public remove(valueSet: ValueSet) {

    }

    public contentTextChanged(value: string) {

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
        this.valueSetService.search()
            .subscribe((results) => {
                this.valueSets = _.map(results.entry, (entry) => <ValueSet> entry.resource);
            });
    }

    ngOnInit() {
        this.getValueSets();
    }

}
