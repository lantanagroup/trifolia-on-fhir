import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../globals';
import {Questionnaire, QuestionnaireItemComponent} from '../models/stu3/fhir';
import * as _ from 'underscore';

@Component({
    selector: 'app-questionnaire-item-modal',
    templateUrl: './questionnaire-item-modal.component.html',
    styleUrls: ['./questionnaire-item-modal.component.css']
})
export class FhirEditQuestionnaireItemModalComponent implements OnInit {
    @Input() item: QuestionnaireItemComponent = new QuestionnaireItemComponent();
    @Input() questionnaire: Questionnaire = new Questionnaire();
    public allQuestions: QuestionnaireItemComponent[] = [];

    constructor(
        public globals: Globals,
        public activeModal: NgbActiveModal) {

    }

    public getAllQuestions(parent?: QuestionnaireItemComponent) {
        let ret = [];

        if (parent) {
            _.each(parent.item, (child) => {
                ret.push(child);
                ret = ret.concat(this.getAllQuestions(child));
            });
        } else {
            _.each(this.questionnaire.item, (child) => {
                ret.push(child);
                ret = ret.concat(this.getAllQuestions(child));
            });
        }

        return ret;
    }

    ngOnInit() {
        this.allQuestions = this.getAllQuestions();
    }
}
