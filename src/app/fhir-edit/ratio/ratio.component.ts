import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirEditRatioModalComponent} from '../ratio-modal/ratio-modal.component';

@Component({
    selector: 'app-fhir-edit-ratio',
    templateUrl: './ratio.component.html',
    styleUrls: ['./ratio.component.css']
})
export class FhirEditRatioComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() required = true;
    @Input() isFormGroup = true;
    @Input() defaultValue = '';
    @Input() tooltipPath: string;
    @Input() tooltipKey: string;

    constructor(
        public modalService: NgbModal,
        public globals: Globals) {
    }

    private checkRemoveProperty(propertyName: string) {
        if (!this.parentObject.hasOwnProperty(this.propertyName)) {
            return;
        }

        const ratio = this.parentObject[this.propertyName];
        const ratioProperty = ratio[propertyName];

        if (!ratioProperty) {
            return;
        }

        const hasChildProperties =
            ratioProperty.hasOwnProperty('value') ||
            ratioProperty.hasOwnProperty('comparator') ||
            ratioProperty.hasOwnProperty('unit') ||
            ratioProperty.hasOwnProperty('system') ||
            ratioProperty.hasOwnProperty('code');

        if (!hasChildProperties) {
            delete ratio[propertyName];
        }
    }

    get ratioNumerator() {
        if (!this.parentObject.hasOwnProperty(this.propertyName)) {
            return null;
        } else if (!this.parentObject[this.propertyName].hasOwnProperty('numerator')) {
            return null;
        }

        return this.parentObject[this.propertyName].numerator.value;
    }

    set ratioNumerator(value: number) {
        if (!this.parentObject.hasOwnProperty(this.propertyName)) {
            return;
        }

        if (!this.parentObject[this.propertyName].hasOwnProperty('numerator')) {
            this.parentObject[this.propertyName].numerator = {};
        }

        if (value === null || value === undefined) {
            delete this.parentObject[this.propertyName].numerator.value;
        } else {
            this.parentObject[this.propertyName].numerator.value = value;
        }

        this.checkRemoveProperty('numerator');
    }

    get ratioDenominator() {
        if (!this.parentObject.hasOwnProperty(this.propertyName)) {
            return null;
        } else if (!this.parentObject[this.propertyName].hasOwnProperty('denominator')) {
            return null;
        }

        return this.parentObject[this.propertyName].denominator.value;
    }

    set ratioDenominator(value: number) {
        if (!this.parentObject.hasOwnProperty(this.propertyName)) {
            return;
        }

        if (!this.parentObject[this.propertyName].hasOwnProperty('denominator')) {
            this.parentObject[this.propertyName].denominator = {};
        }

        if (value === null || value === undefined) {
            delete this.parentObject[this.propertyName].denominator.value;
        } else {
            this.parentObject[this.propertyName].denominator.value = value;
        }

        this.checkRemoveProperty('denominator');
    }

    editRatio() {
        const modalRef = this.modalService.open(FhirEditRatioModalComponent, { size: 'lg' });
        modalRef.componentInstance.ratio = this.parentObject[this.propertyName];
    }

    ngOnInit() {
        if (this.required && !this.parentObject.hasOwnProperty(this.propertyName)) {
            this.parentObject[this.propertyName] = {};
        }
    }
}
