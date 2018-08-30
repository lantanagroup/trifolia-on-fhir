import {Component, OnInit} from '@angular/core';
import {OperationDefinitionService} from '../services/operation-definition.service';
import {OperationDefinition} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-operation-definitions',
    templateUrl: './operation-definitions.component.html',
    styleUrls: ['./operation-definitions.component.css']
})
export class OperationDefinitionsComponent implements OnInit {
    public operationDefinitions: OperationDefinition[] = [];
    public contentText: string;

    constructor(
        private opDefService: OperationDefinitionService,
        private modalService: NgbModal) {

    }

    public contentTextChanged(value: string) {

    }

    public remove(operationDefinition: OperationDefinition) {

    }

    public changeId(operationDefinition: OperationDefinition) {
        const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
        modalRef.componentInstance.resourceType = operationDefinition.resourceType;
        modalRef.componentInstance.originalId = operationDefinition.id;
        modalRef.result.then((newId) => {
            operationDefinition.id = newId;
        });
    }

    public getOperationDefinitions() {
        this.opDefService.search()
            .subscribe((results) => {
                this.operationDefinitions = _.map(results.entry, (entry) => <OperationDefinition> entry.resource);
            });
    }

    ngOnInit() {
        this.getOperationDefinitions();
    }
}
