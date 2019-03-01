import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Globals} from '../../globals';
import {CookieService} from 'angular2-cookie/core';

@Component({
    selector: 'app-fhir-number',
    templateUrl: './number.component.html',
    styleUrls: ['./number.component.css']
})
export class FhirEditNumberComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() required = false;
    @Input() isFormGroup = true;
    @Input() defaultValue = '';
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;
    @Input() placeholder: string;
    @Input() disabled: boolean;

    /**
     * Indicates that the value of the component should be remembered in cookies
     */
    @Input() cookieKey?: string;
    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        public globals: Globals,
        private cookieService: CookieService) {

    }

    public get value(): number {
        if (!this.parentObject[this.propertyName]) {
            return;
        }

        return this.parentObject[this.propertyName];
    }

    public set value(newValue: number) {
        if ((newValue === undefined || newValue === null) && this.parentObject.hasOwnProperty(this.propertyName)) {
            delete this.parentObject[this.propertyName];

            if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
                this.cookieService.remove(this.cookieKey);
            }
        } else if (newValue !== undefined && newValue !== null) {
            this.parentObject[this.propertyName] = newValue;

            if (this.cookieKey) {
                this.cookieService.put(this.cookieKey, newValue.toString());
            }
        }
    }

    public onChanged() {
        this.change.emit(this.parentObject[this.propertyName]);
    }

    ngOnInit() {
        if (this.cookieKey) {
            const valueString = this.cookieService.get(this.cookieKey);

            if (valueString) {
                if (valueString.indexOf('.')) {
                    this.value = parseFloat(valueString);
                } else {
                    this.value = parseInt(valueString);
                }
            }
        }
    }
}
