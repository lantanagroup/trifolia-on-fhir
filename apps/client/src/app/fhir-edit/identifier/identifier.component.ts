import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {Identifier} from '../../models/stu3/fhir';

@Component({
    selector: 'app-fhir-identifier',
    templateUrl: './identifier.component.html',
    styleUrls: ['./identifier.component.css']
})
export class FhirIdentifierComponent implements OnInit {
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

    public get identifier(): Identifier {
        if (this.parentObject) {
            return this.parentObject[this.propertyName];
        }
    }

    public get identifierUse(): string {
        if (this.identifier) {
            return this.identifier.use;
        }

        return '';
    }

    public set identifierUse(value: string) {
        if (this.identifier) {
            this.identifier.use = value;
        }
    }

    public get identifierSystem(): string {
        if (this.identifier) {
            return this.identifier.system;
        }

        return '';
    }

    public set identifierSystem(value: string) {
        if (this.identifier) {
            this.identifier.system = value;
        }
    }

    public get identifierValue(): string {
        if (this.identifier) {
            return this.identifier.value;
        }

        return '';
    }

    public set identifierValue(value: string) {
        if (this.identifier) {
            this.identifier.value = value;
        }
    }

    ngOnInit() {
        if (this.tooltipKey) {
            this.tooltip = Globals.tooltips[this.tooltipKey];
        }

        if (this.required && this.parentObject && !this.parentObject[this.propertyName]) {
            this.parentObject[this.propertyName] = new Identifier();
        }
    }
}
