import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirRatioModalComponent} from '../ratio-modal/ratio-modal.component';

@Component({
  selector: 'app-fhir-edit-ratio',
  templateUrl: './ratio.component.html',
  styleUrls: ['./ratio.component.css']
})
export class FhirRatioComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() required = true;
  @Input() isFormGroup = true;
  @Input() defaultValue = '';
  @Input() tooltipPath: string;
  @Input() tooltipKey: string;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();


  public Globals = Globals;

  constructor(
    public modalService: NgbModal) {
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
    const modalRef = this.modalService.open(FhirRatioModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.ratio = this.parentObject[this.propertyName];
    modalRef.result.then(() => {
      this.change.emit();
    });
  }

  ngOnInit() {
    if (this.parentObject && this.required && !this.parentObject.hasOwnProperty(this.propertyName)) {
      this.parentObject[this.propertyName] = {};
    }
  }
}
