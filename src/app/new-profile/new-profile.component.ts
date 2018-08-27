import {Component, OnInit} from '@angular/core';
import {StructureDefinition} from '../models/stu3/fhir';
import {Globals} from '../globals';
import {StructureDefinitionService} from '../services/structure-definition.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-new-profile',
    templateUrl: './new-profile.component.html',
    styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {
    public structureDefinition = new StructureDefinition();
    public message: string;

    constructor(
        public globals: Globals,
        private route: Router,
        private strucDefService: StructureDefinitionService) {
    }

    public saveDisabled() {
        return !this.structureDefinition.url ||
            !this.structureDefinition.name ||
            !this.structureDefinition.type ||
            !this.structureDefinition.kind ||
            !this.structureDefinition.hasOwnProperty('abstract');
    }

    public save() {
        this.strucDefService.save(this.structureDefinition)
            .subscribe((results) => {
                this.route.navigate(['/structure-definition/' + results.id]);
            }, (err) => {
                this.message = this.globals.getErrorMessage(err);
            });
    }

    ngOnInit() {
    }
}
