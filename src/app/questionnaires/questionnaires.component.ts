import { Component, OnInit } from '@angular/core';
import {Questionnaire} from '../models/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {QuestionnaireService} from '../services/questionnaire.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.css']
})
export class QuestionnairesComponent implements OnInit {
    public questionnaires: Questionnaire[];
    public contentText: string;

    constructor(
        private questionnaireService: QuestionnaireService,
        private modalService: NgbModal) {

    }

    public remove(valueSet: Questionnaire) {

    }

    public contentTextChanged(value: string) {

    }

    public changeId(valueSet: Questionnaire) {
        const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
        modalRef.componentInstance.resourceType = valueSet.resourceType;
        modalRef.componentInstance.originalId = valueSet.id;
        modalRef.result.then((newId) => {
            valueSet.id = newId;
        });
    }

    public getQuestionnaires() {
        this.questionnaireService.search()
            .subscribe((results) => {
                this.questionnaires = _.map(results.entry, (entry) => <Questionnaire> entry.resource);
            });
    }

    ngOnInit() {
        this.getQuestionnaires();
    }
}
