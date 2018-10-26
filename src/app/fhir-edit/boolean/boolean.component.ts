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

    public get value(): boolean {
        if (!this.parentObject) {
            return;
        }

        return this.parentObject[this.propertyName];
    }

    public set value(newValue: boolean) {
        if (newValue !== true && newValue !== false && this.parentObject.hasOwnProperty(this.propertyName)) {
            delete this.parentObject[this.propertyName];
        } else if (newValue === true || newValue === false) {
            this.parentObject[this.propertyName] = newValue;
        }
    }

    ngOnInit() {
        if (!this.parentObject.hasOwnProperty(this.propertyName) && this.required) {
            this.parentObject[this.propertyName] = false;
        }
    }
}
