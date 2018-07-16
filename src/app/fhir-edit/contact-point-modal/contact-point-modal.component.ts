import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ContactPoint} from '../../models/fhir';

@Component({
    selector: 'app-fhir-contact-point-modal',
    templateUrl: './contact-point-modal.component.html',
    styleUrls: ['./contact-point-modal.component.css']
})
export class FhirEditContactPointModalComponent implements OnInit {
    @Input() contactPoint: ContactPoint;

    constructor(
        public activeModal: NgbActiveModal,
        public globals: Globals) {

    }

    ngOnInit() {
    }
}
