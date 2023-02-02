import {Component, OnInit} from '@angular/core';
import {Bundle, Questionnaire} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {QuestionnaireService} from '../shared/questionnaire.service';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';

@Component({
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.css']
})
export class QuestionnairesComponent extends BaseComponent implements OnInit {
  public questionnairesBundle: Bundle;
  public nameText: string;
  public criteriaChangedEvent = new Subject<void>();
  public page = 1;
  public Globals = Globals;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private questionnaireService: QuestionnaireService,
    private modalService: NgbModal) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getQuestionnaires();
      });
  }

  public get questionnaires(): Questionnaire[] {
    if (!this.questionnairesBundle) {
      return [];
    }

    return (this.questionnairesBundle.entry || []).map((entry) => <Questionnaire>entry.resource);
  }

  public remove(questionnaire: Questionnaire) {
    if (!confirm(`Are you sure you want to delete the questionnaire ${questionnaire.title || questionnaire.name || questionnaire.id}`)) {
      return;
    }

    this.questionnaireService.delete(questionnaire.id)
      .subscribe(() => {
        const entry = (this.questionnairesBundle.entry || []).find((e) => e.resource.id === questionnaire.id);
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
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.resourceType = valueSet.resourceType;
    modalRef.componentInstance.originalId = valueSet.id;
    modalRef.result.then((newId) => {
      valueSet.id = newId;
    });
  }

  public getQuestionnaires() {
    this.questionnairesBundle = null;

    this.questionnaireService.search(this.page, this.nameText)
      .subscribe((results) => {
        this.questionnairesBundle = results;
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while searching for questionnaires');
      });
  }

  ngOnInit() {
    this.getQuestionnaires();
    this.configService.fhirServerChanged.subscribe(() => this.getQuestionnaires());
  }
}
