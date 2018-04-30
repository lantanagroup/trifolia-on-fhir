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

    constructor(private structureDefinitionService: StructureDefinitionService, private configService: ConfigService) { }

    delete(profileId: string) {

    }

    private getStructureDefinitions() {
        this.structureDefinitions = [];
        this.configService.setStatusMessage('Loading structure definitions');

        this.structureDefinitionService.getStructureDefinitions()
            .subscribe(structureDefinitions => {
                this.structureDefinitions = structureDefinitions;
                this.configService.setStatusMessage('');
            }, error => {
                this.configService.setStatusMessage('Error loading structure definitions: ' + error);
            });
    }

    ngOnInit() {
        this.getStructureDefinitions();
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getStructureDefinitions());
    }
}
