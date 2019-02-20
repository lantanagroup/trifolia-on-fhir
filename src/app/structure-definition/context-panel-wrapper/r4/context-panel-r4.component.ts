import {Component, Input, OnInit} from '@angular/core';
import {StructureDefinition} from '../../../models/r4/fhir';
import {IContextPanelComponent} from '../context-panel-wrapper.component';
import {Globals} from '../../../globals';

@Component({
    selector: 'app-structure-definition-context-panel-r4',
    templateUrl: './context-panel-r4.component.html',
    styleUrls: ['./context-panel-r4.component.css']
})
export class ContextPanelR4Component implements OnInit, IContextPanelComponent {

    @Input()
    public structureDefinition: StructureDefinition;

    constructor(public globals: Globals) {
    }

    ngOnInit() {
    }

}
