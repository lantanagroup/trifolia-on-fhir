import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fhir-edit-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class FhirEditPeriodComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() required = true;
    @Input() isFormGroup = true;
    @Input() defaultValue = '';
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;

    constructor(
        public modalService: NgbModal,
        public globals: Globals) {
    }

    ngOnInit() {
        if (this.required && !this.parentObject.hasOwnProperty(this.propertyName)) {
            this.parentObject[this.propertyName] = {};
        }
    }
}
