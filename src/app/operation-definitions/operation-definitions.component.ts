import {Component, OnInit} from '@angular/core';
import {OperationDefinitionService} from '../shared/operation-definition.service';
import {Bundle, OperationDefinition} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'app-operation-definitions',
    templateUrl: './operation-definitions.component.html',
    styleUrls: ['./operation-definitions.component.css']
})
export class OperationDefinitionsComponent implements OnInit {
    public operationDefinitionsBundle: Bundle;
    public nameText: string;
    public criteriaChangedEvent = new Subject();
    public page = 1;

    constructor(
        private configService: ConfigService,
        private opDefService: OperationDefinitionService,
        private modalService: NgbModal) {

        this.criteriaChangedEvent
            .debounceTime(500)
            .subscribe(() => {
                this.getOperationDefinitions();
            });
    }

    public get operationDefinitions(): OperationDefinition[] {
        if (!this.operationDefinitionsBundle) {
            return [];
        }

        return _.map(this.operationDefinitionsBundle.entry, (entry) => <OperationDefinition> entry.resource);
    }

    public nameTextChanged(value: string) {
        this.nameText = value;
        this.criteriaChangedEvent.next();
    }

    public remove(operationDefinition: OperationDefinition) {
        if (!confirm(`Are you sure you want to delete the operation definition ${operationDefinition.name || operationDefinition.id}`)) {
            return;
        }

        this.opDefService.delete(operationDefinition.id)
            .subscribe(() => {
                const entry = _.find(this.operationDefinitionsBundle.entry, (entry) => entry.resource.id === operationDefinition.id);
                const index = this.operationDefinitionsBundle.entry.indexOf(entry);
                this.operationDefinitionsBundle.entry.splice(index, 1);
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
        this.operationDefinitionsBundle = null;
        this.opDefService.search(this.page, this.nameText)
            .subscribe((results) => {
                this.operationDefinitionsBundle = results;
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while searching for operation definitions');
            });
    }

    public clearFilters() {
        this.nameText = null;
        this.page = 1;
        this.criteriaChangedEvent.next();
    }

    ngOnInit() {
        this.getOperationDefinitions();
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getOperationDefinitions());
    }
}
