import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';

@Component({
    selector: 'app-fhir-string',
    templateUrl: './string.component.html',
    styleUrls: ['./string.component.css']
})
export class FhirStringComponent implements OnInit {
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
        private cookieService: CookieService) {

    }

    public get value() {
        if (!this.parentObject[this.propertyName]) {
            return '';
        }

        return this.parentObject[this.propertyName];
    }

    public set value(newValue: string) {
        if (!newValue && this.parentObject[this.propertyName]) {
            delete this.parentObject[this.propertyName];

            if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
                this.cookieService.remove(this.cookieKey);
            }
        } else if (newValue) {
            this.parentObject[this.propertyName] = newValue;

            if (this.cookieKey) {
                this.cookieService.put(this.cookieKey, newValue);
            }
        }
    }

    public onChanged() {
        this.change.emit(this.parentObject[this.propertyName]);
    }

    ngOnInit() {
        if (this.cookieKey) {
            this.value = this.cookieService.get(this.cookieKey);
        }
    }
}
