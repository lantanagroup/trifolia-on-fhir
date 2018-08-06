import {Component, Input, OnInit} from '@angular/core';
import {Range} from '../../models/stu3/fhir';
import {Globals} from '../../globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-range-modal',
    templateUrl: './range-modal.component.html',
    styleUrls: ['./range-modal.component.css']
})
export class FhirEditRangeModalComponent implements OnInit {
    @Input() range: Range;

    constructor(
        public globals: Globals,
        public activeModal: NgbActiveModal) {

    }

    ngOnInit() {
    }
}
