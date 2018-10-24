import {Component, OnInit} from '@angular/core';
import {OperationDefinitionService} from '../services/operation-definition.service';
import {OperationDefinition} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../services/config.service';

@Component({
    selector: 'app-operation-definitions',
    templateUrl: './operation-definitions.component.html',
    styleUrls: ['./operation-definitions.component.css']
})
export class OperationDefinitionsComponent implements OnInit {
    public operationDefinitions: OperationDefinition[] = [];
    public contentText: string;

    constructor(
        private configService: ConfigService,
        private opDefService: OperationDefinitionService,
        private modalService: NgbModal) {

    }

    public contentTextChanged(value: string) {

    }

    public remove(operationDefinition: OperationDefinition) {
        if (!confirm(`Are you sure you want to delete the operation definition ${operationDefinition.name || operationDefinition.id}`)) {
            return;
        }

        this.opDefService.delete(operationDefinition.id)
            .subscribe(() => {
                const index = this.operationDefinitions.indexOf(operationDefinition);
                this.operationDefinitions.splice(index, 1);
            }, (err) => {
                this.configService.handleError(err, 'An error cocurred while deleting the operation definition');
            });
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
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while searching for operation definitions');
            });
    }

    ngOnInit() {
        this.getOperationDefinitions();
    }
}
