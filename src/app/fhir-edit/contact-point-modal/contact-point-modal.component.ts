import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ContactPoint} from '../../models/stu3/fhir';

@Component({
    selector: 'app-fhir-contact-point-modal',
    templateUrl: './contact-point-modal.component.html',
    styleUrls: ['./contact-point-modal.component.css']
})
export class FhirContactPointModalComponent implements OnInit {
    @Input() contactPoint: ContactPoint;

    public Globals = Globals;

    constructor(
        public activeModal: NgbActiveModal) {

    }

    ngOnInit() {
    }
}
