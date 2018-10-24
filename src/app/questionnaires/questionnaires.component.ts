import { Component, OnInit } from '@angular/core';
import {Questionnaire} from '../models/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {QuestionnaireService} from '../services/questionnaire.service';
import * as _ from 'underscore';
import {ConfigService} from '../services/config.service';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.css']
})
export class QuestionnairesComponent implements OnInit {
    public questionnaires: Questionnaire[];
    public contentText: string;

    constructor(
        private configService: ConfigService,
        private questionnaireService: QuestionnaireService,
        private modalService: NgbModal) {

    }

    public remove(questionnaire: Questionnaire) {
        if (!confirm(`Are you sure you want to delete the questionnaire ${questionnaire.title || questionnaire.name || questionnaire.id}`)) {
            return;
        }

        this.questionnaireService.delete(questionnaire.id)
            .subscribe(() => {
                const index = this.questionnaires.indexOf(questionnaire);
                this.questionnaires.splice(index, 1);
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while deleting the questionnaire');
            });
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
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while searching for questionnaires');
            });
    }

    ngOnInit() {
        this.getQuestionnaires();
    }
}
