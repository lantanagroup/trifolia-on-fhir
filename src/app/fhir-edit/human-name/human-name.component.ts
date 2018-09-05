import {Component, Input, OnInit} from '@angular/core';
import { HumanName } from '../../models/stu3/fhir';
import {Globals} from '../../globals';
import {FhirEditHumanNameModalComponent} from '../human-name-modal/human-name-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-fhir-edit-human-name',
    templateUrl: './human-name.component.html',
    styleUrls: ['./human-name.component.css']
})
export class HumanNameComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() required = false;
    @Input() isFormGroup = true;
    @Input() defaultValue = '';
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;

    constructor(
        public modalService: NgbModal,
        public globals: Globals) {
    }

    get humanNameGiven(): string {
        const noGivenName = !this.parentObject[this.propertyName] ||
            !this.parentObject[this.propertyName].given ||
            this.parentObject[this.propertyName].given.length === 0;

        if (noGivenName) {
            return '';
        }

        return this.parentObject[this.propertyName].given[0];
    }

    set humanNameGiven(value: string) {
        if (!this.parentObject[this.propertyName]) {
            return;
        }

        if (!this.parentObject[this.propertyName].given) {
            this.parentObject[this.propertyName].given = [];
        }

        if (this.parentObject[this.propertyName].given.length === 0) {
            this.parentObject[this.propertyName].given.push('');
        }

        if (!value) {
            if (this.parentObject[this.propertyName].given && this.parentObject[this.propertyName].given.length > 1) {
                this.parentObject[this.propertyName].given[0] = value;
            } else {
                delete this.parentObject[this.propertyName].given;
            }
        } else {
            this.parentObject[this.propertyName].given[0] = value;
        }
    }

    get humanNameFamily(): string {
        if (!this.parentObject[this.propertyName] || !this.parentObject[this.propertyName].family) {
            return '';
        }

        return this.parentObject[this.propertyName].family;
    }

    set humanNameFamily(value: string) {
        if (!this.parentObject[this.propertyName]) {
            return;
        }

        if (!value) {
            delete this.parentObject[this.propertyName].family;
        } else {
            this.parentObject[this.propertyName].family = value;
        }
    }

    editHumanName() {
        const modalRef = this.modalService.open(FhirEditHumanNameModalComponent);
        modalRef.componentInstance.humanName = this.parentObject[this.propertyName];
    }

    ngOnInit() {
        if (this.required && !this.parentObject[this.propertyName]) {
            this.parentObject[this.propertyName] = {};
        }
    }
}
