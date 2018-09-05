import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';

@Component({
    selector: 'app-fhir-boolean',
    templateUrl: './boolean.component.html',
    styleUrls: ['./boolean.component.css']
})
export class BooleanComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() required = false;
    @Input() isFormGroup = true;
    @Input() defaultValue = false;
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;

    constructor(
        public globals: Globals) {
    }

    ngOnInit() {
    }

}
