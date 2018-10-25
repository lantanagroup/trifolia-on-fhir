import {Component, OnInit} from '@angular/core';
import {StructureDefinitionService} from '../services/structure-definition.service';
import {StructureDefinitionListItemModel} from '../models/structure-definition-list-item-model';
import {ConfigService} from '../services/config.service';
import {StructureDefinitionListModel} from '../models/structure-definition-list-model';
import {Subject} from 'rxjs';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {Bundle, ImplementationGuide} from '../models/stu3/fhir';
import * as _ from 'underscore';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'app-profiles',
    templateUrl: './structure-definitions.component.html',
    styleUrls: ['./structure-definitions.component.css']
})
export class StructureDefinitionsComponent implements OnInit {
    public response: StructureDefinitionListModel;
    public message: string;
    public page = 1;
    public nameText: string;
    public urlText: string;
    public criteriaChangedEvent = new Subject();
    public implementationGuidesBundle: Bundle;
    public implementationGuideId: string = null;

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

    public get implementationGuides() {
        if (!this.implementationGuidesBundle) {
            return [];
        }

        return _.map(this.implementationGuidesBundle.entry, (entry) => <ImplementationGuide> entry.resource);
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

    public clearFilters() {
        this.nameText = null;
        this.urlText = null;
        this.implementationGuideId = null;
        this.criteriaChanged();
    }

    public getStructureDefinitions() {
        this.response = null;
        this.configService.setStatusMessage('Loading structure definitions');

        this.structureDefinitionService.getStructureDefinitions(this.page, this.nameText, this.urlText, this.implementationGuideId)
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
                this.implementationGuidesBundle = results;
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
