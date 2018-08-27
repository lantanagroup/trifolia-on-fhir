import {Component, Input, OnInit} from '@angular/core';
import {Coding} from '../../models/stu3/fhir';
import {Globals} from '../../globals';
import {Observable} from 'rxjs/Observable';
import * as _ from 'underscore';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
    selector: 'app-fhir-select-single-code',
    templateUrl: './select-single-code.component.html',
    styleUrls: ['./select-single-code.component.css']
})
export class SelectSingleCodeComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() codes: Coding[];
    @Input() required: boolean;
    @Input() tooltip: string;
    @Input() tooltipKey: string;
    @Input() title: string;
    @Input() isFormGroup = true;
    @Input() isTypeahead = false;
    @Input() defaultCode: string;

    constructor(public globals: Globals) {
    }

    public getDefaultCode(): string {
        if (this.defaultCode) {
            return this.defaultCode;
        }

        if (this.codes.length > 0) {
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
        if (this.tooltipKey) {
            this.tooltip = this.globals.tooltips[this.tooltipKey];
        }

        if (this.required && !this.parentObject.hasOwnProperty(this.propertyName)) {
            this.globals.toggleProperty(this.parentObject, this.propertyName, this.getDefaultCode());
        }
    }
}
