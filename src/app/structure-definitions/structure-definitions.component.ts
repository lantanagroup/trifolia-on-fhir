import { Component, OnInit } from '@angular/core';
import { StructureDefinitionService } from '../services/structure-definition.service';
import { StructureDefinitionListItemModel } from '../models/structure-definition-list-item-model';
import { ConfigService } from '../services/config.service';

@Component({
    selector: 'app-profiles',
    templateUrl: './structure-definitions.component.html',
    styleUrls: ['./structure-definitions.component.css'],
    providers: [StructureDefinitionService]
})
export class StructureDefinitionsComponent implements OnInit {
    public structureDefinitions: StructureDefinitionListItemModel[];
    public message: string;

    constructor(private structureDefinitionService: StructureDefinitionService, private configService: ConfigService) { }

    delete(strucDefListItem: StructureDefinitionListItemModel) {
        if (!confirm(`Are you sure you want to delete the structure definition ${strucDefListItem.name}`)) {
            return;
        }

        this.structureDefinitionService.delete(strucDefListItem.id)
            .subscribe(() => {
                this.message = `Successfully deleted structure definition ${strucDefListItem.name} (${strucDefListItem.id})`;
                const index = this.structureDefinitions.indexOf(strucDefListItem);
                this.structureDefinitions.splice(index, 1);
                setTimeout(() => this.message = '', 3000);
            }, (err) => {
                this.message = err;
            });
    }

    private getStructureDefinitions() {
        this.structureDefinitions = [];
        this.configService.setStatusMessage('Loading structure definitions');

        this.structureDefinitionService.getStructureDefinitions()
            .subscribe(structureDefinitions => {
                this.structureDefinitions = structureDefinitions;
                this.configService.setStatusMessage('');
            }, error => {
                this.configService.handleError('Error loading structure definitions.', error);
            });
    }

    ngOnInit() {
        this.getStructureDefinitions();
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getStructureDefinitions());
    }
}
