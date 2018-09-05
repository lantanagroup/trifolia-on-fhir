import {Component, EventEmitter, OnInit} from '@angular/core';
import { StructureDefinitionService } from '../services/structure-definition.service';
import { StructureDefinitionListItemModel } from '../models/structure-definition-list-item-model';
import { ConfigService } from '../services/config.service';
import {StructureDefinitionListModel} from '../models/structure-definition-list-model';
import 'rxjs/add/operator/debounceTime';
import {Subject} from 'rxjs/Subject';
import {CapabilityStatement} from '../models/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-profiles',
    templateUrl: './structure-definitions.component.html',
    styleUrls: ['./structure-definitions.component.css']
})
export class StructureDefinitionsComponent implements OnInit {
    public response: StructureDefinitionListModel;
    public message: string;
    public page = 1;
    public contentText: string;
    public urlText: string;
    public criteriaChangedEvent = new Subject();

    constructor(
        private structureDefinitionService: StructureDefinitionService,
        private configService: ConfigService,
        private modalService: NgbModal) {
        this.criteriaChangedEvent
            .debounceTime(500)
            .subscribe(() => {
                this.getStructureDefinitions();
            });
    }

    public remove(structureDefinitionListItem: StructureDefinitionListItemModel) {
        if (!confirm(`Are you sure you want to delete the structure definition ${structureDefinitionListItem.name}`)) {
            return;
        }

        this.structureDefinitionService.delete(structureDefinitionListItem.id)
            .subscribe(() => {
                this.message = `Successfully deleted structure definition ${structureDefinitionListItem.name} (${structureDefinitionListItem.id})`;
                const index = this.response.items.indexOf(structureDefinitionListItem);
                this.response.items.splice(index, 1);
                setTimeout(() => this.message = '', 3000);
            }, (err) => {
                this.message = err;
            });
    }

    public changeId(structureDefinitionListItem: StructureDefinitionListItemModel) {
        const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
        modalRef.componentInstance.resourceType = 'StructureDefinition';
        modalRef.componentInstance.originalId = structureDefinitionListItem.id;
        modalRef.result.then((newId) => {
            structureDefinitionListItem.id = newId;
        });
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

    public getStructureDefinitions() {
        this.response = null;
        this.configService.setStatusMessage('Loading structure definitions');

        this.structureDefinitionService.getStructureDefinitions(this.page, this.contentText, this.urlText)
            .subscribe((response: StructureDefinitionListModel) => {
                this.response = response;
                this.configService.setStatusMessage('');
            }, error => {
                this.configService.handleError('Error loading structure definitions.', error);
            });
    }

    ngOnInit() {
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getStructureDefinitions());
        this.getStructureDefinitions();
    }
}
