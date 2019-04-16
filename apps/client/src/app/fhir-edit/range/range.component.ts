import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirRangeModalComponent} from '../range-modal/range-modal.component';

@Component({
  selector: 'app-fhir-edit-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.css']
})
export class FhirRangeComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() required = true;
  @Input() isFormGroup = true;
  @Input() defaultValue = '';
  @Input() tooltipPath: string;
  @Input() tooltipKey: string;

  public Globals = Globals;

  constructor(
    public modalService: NgbModal) {
  }

  private checkRemoveProperty(propertyName: string) {
    if (!this.parentObject.hasOwnProperty(this.propertyName)) {
      return;
    }

    const range = this.parentObject[this.propertyName];
    const rangeProperty = range[propertyName];

    if (!rangeProperty) {
      return;
    }

    const hasChildProperties =
      rangeProperty.hasOwnProperty('value') ||
      rangeProperty.hasOwnProperty('comparator') ||
      rangeProperty.hasOwnProperty('unit') ||
      rangeProperty.hasOwnProperty('system') ||
      rangeProperty.hasOwnProperty('code');

    if (!hasChildProperties) {
      delete range[propertyName];
    }
  }

  get rangeLow() {
    if (!this.parentObject.hasOwnProperty(this.propertyName)) {
      return null;
    } else if (!this.parentObject[this.propertyName].hasOwnProperty('low')) {
      return null;
    }

    return this.parentObject[this.propertyName].low.value;
  }

  set rangeLow(value: number) {
    if (!this.parentObject.hasOwnProperty(this.propertyName)) {
      return;
    }

    if (!this.parentObject[this.propertyName].hasOwnProperty('low')) {
      this.parentObject[this.propertyName].low = {};
    }

    if (value === null || value === undefined) {
      delete this.parentObject[this.propertyName].low.value;
    } else {
      this.parentObject[this.propertyName].low.value = value;
    }

    this.checkRemoveProperty('low');
  }

  get rangeHigh() {
    if (!this.parentObject.hasOwnProperty(this.propertyName)) {
      return null;
    } else if (!this.parentObject[this.propertyName].hasOwnProperty('high')) {
      return null;
    }

    return this.parentObject[this.propertyName].high.value;
  }

  set rangeHigh(value: number) {
    if (!this.parentObject.hasOwnProperty(this.propertyName)) {
      return;
    }

    if (!this.parentObject[this.propertyName].hasOwnProperty('high')) {
      this.parentObject[this.propertyName].high = {};
    }

    if (value === null || value === undefined) {
      delete this.parentObject[this.propertyName].high.value;
    } else {
      this.parentObject[this.propertyName].high.value = value;
    }

    this.checkRemoveProperty('high');
  }

  editRange() {
    const modalRef = this.modalService.open(FhirRangeModalComponent);
    modalRef.componentInstance.range = this.parentObject[this.propertyName];
  }

  ngOnInit() {
    if (this.parentObject && this.required && !this.parentObject.hasOwnProperty(this.propertyName)) {
      this.parentObject[this.propertyName] = {};
    }
  }
}
