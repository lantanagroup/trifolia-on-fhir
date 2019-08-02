import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fhir-edit-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class FhirPeriodComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() required = true;
  @Input() isFormGroup = true;
  @Input() defaultValue = '';
  @Input() tooltipKey: string;
  @Input() tooltipPath: string;

  public Globals = Globals;

  constructor(public modalService: NgbModal) {
  }

  ngOnInit() {
    if (this.parentObject && this.required && !this.parentObject.hasOwnProperty(this.propertyName)) {
      this.parentObject[this.propertyName] = {};
    }
  }
}
