import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Coding} from '../../models/stu3/fhir';
import {Globals} from '../../globals';
import {Observable} from 'rxjs';
import * as _ from 'underscore';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {FhirService} from '../../services/fhir.service';

@Component({
    selector: 'app-fhir-select-single-code',
    templateUrl: './select-single-code.component.html',
    styleUrls: ['./select-single-code.component.css']
})
export class FhirSelectSingleCodeComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() codes: Coding[];
    @Input() valueSetUrl: string;
    @Input() required: boolean;
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;
    @Input() title: string;
    @Input() isFormGroup = true;
    @Input() isTypeahead = false;
    @Input() defaultCode: string;
    @Output() change = new EventEmitter<Coding>();

    constructor(
        public globals: Globals,
        private fhirService: FhirService) {
    }

    public selectedCodeChanged() {
        this.change.emit(this.parentObject[this.propertyName]);
    }

    public get theValue() {
        if (this.parentObject) {
            return this.parentObject[this.propertyName] || '';
        }

        return '';
    }

    public set theValue(value: any) {
        if (!value && this.theValue) {
            delete this.parentObject[this.propertyName];
        } else if (value && this.parentObject) {
            this.parentObject[this.propertyName] = value;
        }
    }

    public getDefaultCode(): string {
        if (this.defaultCode) {
            return this.defaultCode;
        }

        if (this.codes && this.codes.length > 0) {
            return this.codes[0].code || this.codes[0].display;
        }

        return '';
    }

    private searchCodes(term: string) {
        const searchTerm = term.toLowerCase();
        return _.chain(this.codes)
            .filter((coding) => {
                if (coding.code && coding.code.toLowerCase().indexOf(searchTerm) >= 0) {
                    return true;
                }
                if (coding.system && coding.system.toLowerCase().indexOf(searchTerm) >= 0) {
                    return true;
                }
                if (coding.display && coding.display.toLowerCase().indexOf(searchTerm) >= 0) {
                    return true;
                }
                return false;
            })
            .map((coding) => coding.code)
            .value();
    }

    public typeaheadFormatter = (result: string) => {
        const foundCode = _.find(this.codes, (coding) => coding.code === result);

        if (foundCode && foundCode.display) {
            return foundCode.display + ' (' + foundCode.code + ')';
        }

        return result;
    }

    public typeaheadSearch = (text$: Observable<string>) => text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map((term: string) => term.length < 2 ? [] : this.searchCodes(term))
    )

    ngOnInit() {
        if (!this.codes && this.valueSetUrl) {
            this.codes = this.fhirService.getValueSetCodes(this.valueSetUrl);
        }

        if (this.required && !this.parentObject.hasOwnProperty(this.propertyName)) {
            this.globals.toggleProperty(this.parentObject, this.propertyName, this.getDefaultCode());
        }
    }
}
