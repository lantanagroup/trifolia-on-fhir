import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {ConceptReferenceComponent} from '../../models/stu3/fhir';

@Component({
    selector: 'app-fhir-value-set-include-concept-modal',
    templateUrl: './value-set-include-concept-modal.component.html',
    styleUrls: ['./value-set-include-concept-modal.component.css']
})
export class FhirValueSetIncludeConceptModalComponent implements OnInit {
    @Input() concept: ConceptReferenceComponent;

    constructor(
        public activeModal: NgbActiveModal,
        public globals: Globals) {
    }

    ngOnInit() {
    }
}
