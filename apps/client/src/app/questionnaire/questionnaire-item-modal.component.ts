import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Questionnaire, QuestionnaireItemComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from 'libs/tof-lib/src/lib/globals';

@Component({
  selector: 'app-questionnaire-item-modal',
  templateUrl: './questionnaire-item-modal.component.html',
  styleUrls: ['./questionnaire-item-modal.component.css']
})
export class QuestionnaireItemModalComponent implements OnInit {
  @Input() item: QuestionnaireItemComponent = new QuestionnaireItemComponent();
  @Input() questionnaire: Questionnaire = new Questionnaire();

  public allQuestions: QuestionnaireItemComponent[] = [];
  public Globals = Globals;

  constructor(
    public activeModal: NgbActiveModal) {

  }

  public getAllQuestions(parent?: QuestionnaireItemComponent) {
    let ret = [];

    if (parent) {
      (parent.item || []).forEach((child) => {
        ret.push(child);
        ret = ret.concat(this.getAllQuestions(child));
      });
    } else {
      (this.questionnaire.item || []).forEach((child) => {
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
