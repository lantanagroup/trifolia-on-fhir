import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {UsageContext} from '../../models/stu3/fhir';

@Component({
    selector: 'app-fhir-multi-use-context',
    templateUrl: './multi-use-context.component.html',
    styleUrls: ['./multi-use-context.component.css']
})
export class MultiUseContextComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;

    constructor(public globals: Globals) {
    }

    public getUseContextCodeType(useContext: UsageContext) {
        if (useContext.hasOwnProperty('valueCodeableConcept')) {
            return 'CodeableConcept';
        } else if (useContext.hasOwnProperty('valueQuantity')) {
            return 'Quantity';
        } else if (useContext.hasOwnProperty('valueRange')) {
            return 'Range';
        }
    }

    public setUseContextCodeType(useContext: UsageContext, type: string) {
        if (useContext.hasOwnProperty('value' + type)) {
            return;
        }

        delete useContext.valueCodeableConcept;
        delete useContext.valueQuantity;
        delete useContext.valueRange;

        switch (type) {
            case 'CodeableConcept':
                useContext.valueCodeableConcept = {
                    coding: []
                };
                break;
            case 'Quantity':
                useContext.valueQuantity = {
                    unit: '',
                    value: null
                };
                break;
            case 'Range':
                useContext.valueRange = {
                    low: {
                        unit: '',
                        value: null
                    },
                    high: {
                        unit: '',
                        value: null
                    }
                };
                break;
        }
    }

    ngOnInit() {
    }
}
