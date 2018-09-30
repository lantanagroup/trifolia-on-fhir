import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {QuestionnaireItemComponent} from '../../models/stu3/fhir';

@Component({
    selector: 'app-questionnaire-item-modal',
    templateUrl: './questionnaire-item-modal.component.html',
    styleUrls: ['./questionnaire-item-modal.component.css']
})
export class FhirEditQuestionnaireItemModalComponent implements OnInit {
    @Input() item: QuestionnaireItemComponent;

    constructor(
        public globals: Globals,
        public activeModal: NgbActiveModal) {

    }

    ngOnInit() {
    }

}
