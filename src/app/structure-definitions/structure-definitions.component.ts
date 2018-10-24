import {Component, OnInit} from '@angular/core';
import {StructureDefinitionService} from '../services/structure-definition.service';
import {StructureDefinitionListItemModel} from '../models/structure-definition-list-item-model';
import {ConfigService} from '../services/config.service';
import {StructureDefinitionListModel} from '../models/structure-definition-list-model';
import 'rxjs/add/operator/debounceTime';
import {Subject} from 'rxjs';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {ImplementationGuideListItemModel} from '../models/implementation-guide-list-item-model';

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
    public implementationGuides: ImplementationGuideListItemModel[] = [];
    public implementationGuideId: string;

    constructor(
        private implementationGuideService: ImplementationGuideService,
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

    public lastPage() {
        this.page = this.response.pages;
        this.criteriaChanged();
    }

    public firstPage() {
        this.page = 1;
        this.criteriaChanged();
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

        this.structureDefinitionService.getStructureDefinitions(this.page, this.contentText, this.urlText, this.implementationGuideId)
            .subscribe((response: StructureDefinitionListModel) => {
                this.response = response;
                this.configService.setStatusMessage('');
            }, (err) => {
                this.configService.handleError(err, 'Error loading structure definitions.');
            });
    }

    public getImplementationGuides() {
        this.implementationGuideService.getImplementationGuides()
            .subscribe((results) => {
                this.implementationGuides = results;
            }, (err) => {
                this.configService.handleError(err, 'Error loading implementation guides.');
            });
    }

    private initData() {
        this.getStructureDefinitions();
        this.getImplementationGuides();
    }

    ngOnInit() {
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.initData());
        this.initData();
    }
}
