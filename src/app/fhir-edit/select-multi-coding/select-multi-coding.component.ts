import {Component, Input, OnInit} from '@angular/core';
import {Coding} from '../../models/stu3/fhir';
import {Globals} from '../../globals';
import {FhirService} from '../../services/fhir.service';

@Component({
    selector: 'app-fhir-select-multi-coding',
    templateUrl: './select-multi-coding.component.html',
    styleUrls: ['./select-multi-coding.component.css']
})
export class FhirSelectMultiCodingComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() codes: Coding[];
    @Input() required: boolean;
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;
    @Input() title: string;
    @Input() matchSystem = true;
    @Input() matchCode = true;

    public tooltip: string;
    public Globals = Globals;

    constructor(
        private fhirService: FhirService) {
    }

    public get coding(): Coding[] {
        if (this.parentObject && this.parentObject[this.propertyName]) {
            return this.parentObject[this.propertyName];
        }

        return [];
    }

    public getCodeType(code: Coding) {
        if (!this.codes || this.codes.length === 0) {
            return 'custom';
        }

        const foundOption = Globals.getSelectCoding(code, this.codes, this.matchSystem, this.matchCode);

        if (foundOption) {
            return 'pre';
        }

        return 'custom';
    }

    public setCodeType(codeIndex, value: 'pre' | 'custom') {
        if (!this.parentObject.hasOwnProperty(this.propertyName)) {
            return;
        }

        if (value === 'pre') {
            if (this.codes.length > 0) {
                this.coding[codeIndex] = this.codes[0];
            }
        } else if (value === 'custom') {
            this.coding[codeIndex] = {
                code: ''
            };
        }
    }

    public getCoding(codeIndex): Coding {
        const code = this.coding[codeIndex];
        const foundOption = Globals.getSelectCoding(code, this.codes, this.matchSystem, this.matchCode);

        if (foundOption) {
            return foundOption;
        }
    }

    public setCoding(codeIndex, value: Coding) {
        const code = this.coding[codeIndex];
        Object.assign(code, value);
    }

    public getCode(index: number): string {
        const coding = this.coding[index];

        if (coding) {
            return coding.code;
        }
    }

    public setCode(index: number, value) {
        const coding = this.coding[index];

        if (coding) {
            if (!value && coding.code) {
                delete coding.code;
            } else if (value) {
                coding.code = <string> value;
            }
        }
    }

    public getDisplay(index: number): string {
        const coding = this.coding[index];

        if (coding) {
            return coding.display;
        }
    }

    public setDisplay(index: number, value) {
        const coding = this.coding[index];

        if (coding) {
            if (!value && coding.display) {
                delete coding.display;
            } else if (value) {
                coding.display = <string> value;
            }
        }
    }

    public getSystem(index: number): string {
        const coding = this.coding[index];

        if (coding) {
            return coding.system;
        }
    }

    public setSystem(index: number, value) {
        const coding = this.coding[index];

        if (coding) {
            if (!value && coding.system) {
                delete coding.system;
            } else if (value) {
                coding.system = <string> value;
            }
        }
    }

    ngOnInit() {
        if (this.tooltipKey) {
            this.tooltip = Globals.tooltips[this.tooltipKey];
        } else if (this.tooltipPath) {
            this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
        }
    }
}
