import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Address} from '../../models/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';

@Component({
    selector: 'app-address-modal',
    templateUrl: './address-modal.component.html',
    styleUrls: ['./address-modal.component.css']
})
export class FhirEditAddressModalComponent implements OnInit, DoCheck {
    @Input() address: Address;

    constructor(
        public activeModal: NgbActiveModal,
        public globals: Globals) {

    }

    isRequired() {
        return !!this.address.use || !!this.address.type || (!!this.address.line && this.address.line.length > 0) ||
            !!this.address.city || !!this.address.district || !!this.address.state || !!this.address.postalCode ||
            !!this.address.country || !!this.address.period;
    }

    ngOnInit() {
    }

    ngDoCheck() {
        if (!this.isRequired()) {
            return;
        }

        const values: string[] = [];

        if (this.address.line && this.address.line.length > 0) {
            for (let i = 0; i < this.address.line.length; i++) {
                values.push(this.address.line[i]);
            }
        }

        if (this.address.city) {
            values.push(this.address.city);
        }

        if (this.address.district) {
            values.push(this.address.district);
        }

        if (this.address.state) {
            values.push(this.address.state);
        }

        if (this.address.postalCode) {
            values.push(this.address.postalCode);
        }

        if (this.address.country) {
            values.push(this.address.country);
        }

        if (this.address.type) {
            const type = this.address.type + (values.length > 0 ? ':' : '');
            values.splice(0, 0, type);
        }

        if (this.address.use) {
            const use = (values.length > 0 ? '(' : '') + this.address.use + (values.length > 0 ? ')' : '');
            values.push(use);
        }

        this.address.text = values.join(' ');
    }
}
