import {Component, Input, OnInit} from '@angular/core';
import {StructureDefinition} from '../../../models/stu3/fhir';
import {IContextPanelComponent} from '../context-panel-wrapper.component';
import {Globals} from '../../../globals';

@Component({
    selector: 'app-structure-definition-context-panel-stu3',
    templateUrl: './context-panel-stu3.component.html',
    styleUrls: ['./context-panel-stu3.component.css']
})
export class ContextPanelStu3Component implements OnInit, IContextPanelComponent {
    @Input()
    public structureDefinition: StructureDefinition;

    public Globals = Globals;

    constructor() {
    }

    ngOnInit() {
    }

}
