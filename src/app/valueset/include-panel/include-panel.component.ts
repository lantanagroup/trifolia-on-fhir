import {Component, Input, OnInit} from '@angular/core';
import {ConceptSetComponent} from '../../models/stu3/fhir';

@Component({
    selector: 'app-valueset-include-panel',
    templateUrl: './include-panel.component.html',
    styleUrls: ['./include-panel.component.css']
})
export class IncludePanelComponent implements OnInit {
    @Input() include: ConceptSetComponent;

    constructor() {
    }

    ngOnInit() {
    }
}
