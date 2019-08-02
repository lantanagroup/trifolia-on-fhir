import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Address} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.css']
})
export class FhirAddressModalComponent implements OnInit, DoCheck {
  @Input() address: Address;

  public Globals = Globals;

  constructor(
    public activeModal: NgbActiveModal) {

  }

  isRequired() {
    if (!this.address) {
      return false;
    }

    return !!this.address.use || !!this.address.type || (!!this.address.line && this.address.line.length > 0) ||
      !!this.address.city || !!this.address.district || !!this.address.state || !!this.address.postalCode ||
      !!this.address.country || !!this.address.period;
  }

  ngOnInit() {
  }

  ngDoCheck() {
    if (!this.isRequired() || !this.address) {
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
