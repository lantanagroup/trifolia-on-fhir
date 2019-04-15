import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';

@Component({
    selector: 'app-fhir-quantity',
    templateUrl: './quantity.component.html',
    styleUrls: ['./quantity.component.css']
})
export class FhirQuantityComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() required = false;
    @Input() isFormGroup = true;
    @Input() defaultValue = {};
    @Input() tooltip: string;
    @Input() tooltipKey: string;

    public Globals = Globals;

    constructor() {

    }

    ngOnInit() {
        if (this.tooltipKey) {
            this.tooltip = Globals.tooltips[this.tooltipKey];
        }
    }
}
