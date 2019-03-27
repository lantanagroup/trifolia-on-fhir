import { Component, OnInit } from '@angular/core';
import {Bundle, Questionnaire} from '../models/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {QuestionnaireService} from '../shared/questionnaire.service';
import * as _ from 'underscore';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import {Globals} from '../globals';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.css']
})
export class QuestionnairesComponent implements OnInit {
    public questionnairesBundle: Bundle;
    public nameText: string;
    public criteriaChangedEvent = new Subject();
    public page = 1;
    public Globals = Globals;

    constructor(
        public configService: ConfigService,
        private questionnaireService: QuestionnaireService,
        private modalService: NgbModal) {

        this.criteriaChangedEvent
            .debounceTime(500)
            .subscribe(() => {
                this.getQuestionnaires();
            });
    }

    public get questionnaires(): Questionnaire[] {
        if (!this.questionnairesBundle) {
            return [];
        }

        return _.map(this.questionnairesBundle.entry, (entry) => <Questionnaire> entry.resource);
    }

    public remove(questionnaire: Questionnaire) {
        if (!confirm(`Are you sure you want to delete the questionnaire ${questionnaire.title || questionnaire.name || questionnaire.id}`)) {
            return;
        }

        this.questionnaireService.delete(questionnaire.id)
            .subscribe(() => {
                const entry = _.find(this.questionnairesBundle.entry, (entry) => entry.resource.id === questionnaire.id);
                const index = this.questionnairesBundle.entry.indexOf(entry);
                this.questionnairesBundle.entry.splice(index, 1);
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while deleting the questionnaire');
            });
    }

    public nameTextChanged(value: string) {
        this.nameText = value;
        this.page = 1;
        this.criteriaChangedEvent.next();
    }

    public clearFilters() {
        this.nameText = null;
        this.page = 1;
        this.criteriaChangedEvent.next();
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
        this.questionnaireService.search(this.page, this.nameText)
            .subscribe((results) => {
                this.questionnairesBundle = results;
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while searching for questionnaires');
            });
    }

    ngOnInit() {
        this.getQuestionnaires();
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getQuestionnaires());
    }
}
