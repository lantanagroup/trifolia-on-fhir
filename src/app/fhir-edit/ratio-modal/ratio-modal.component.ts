import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Ratio} from '../../models/stu3/fhir';

@Component({
    selector: 'app-fhir-edit-ratio-modal',
    templateUrl: './ratio-modal.component.html',
    styleUrls: ['./ratio-modal.component.css']
})
export class FhirRatioModalComponent implements OnInit {
    @Input() ratio: Ratio;

    constructor(
        public globals: Globals,
        public activeModal: NgbActiveModal) {

    }

    ngOnInit() {
    }
}
