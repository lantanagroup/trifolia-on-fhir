import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {CookieService} from 'angular2-cookie/core';

@Component({
    selector: 'app-fhir-boolean',
    templateUrl: './boolean.component.html',
    styleUrls: ['./boolean.component.css']
})
export class FhirBooleanComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() required = false;
    @Input() isFormGroup = true;
    @Input() defaultValue = false;
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;

    /**
     * Indicates that the value of the component should be remembered in cookies
     */
    @Input() cookieKey?: string;

    constructor(
        public globals: Globals,
        private cookieService: CookieService) {
    }

    public get value(): boolean {
        if (!this.parentObject) {
            return;
        }

        return this.parentObject[this.propertyName];
    }

    public set value(newValue: boolean) {
        if (newValue !== true && newValue !== false && this.parentObject && this.parentObject.hasOwnProperty(this.propertyName)) {
            delete this.parentObject[this.propertyName];

            if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
                this.cookieService.remove(this.cookieKey);
            }
        } else if (newValue === true || newValue === false) {
            this.parentObject[this.propertyName] = newValue;

            if (this.cookieKey) {
                this.cookieService.put(this.cookieKey, newValue.toString());
            }
        }
    }

    ngOnInit() {
        if (this.parentObject && !this.parentObject.hasOwnProperty(this.propertyName) && this.required) {
            this.parentObject[this.propertyName] = false;
        }

        if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
            this.value = this.cookieService.get(this.cookieKey).toLowerCase() === 'true';
        }
    }
}
