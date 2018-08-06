import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Identifier} from '../../models/stu3/fhir';
import {Globals} from '../../globals';

@Component({
  selector: 'app-fhir-identifier-modal',
  templateUrl: './identifier-modal.component.html',
  styleUrls: ['./identifier-modal.component.css']
})
export class IdentifierModalComponent implements OnInit {
  @Input() identifier: Identifier;

  constructor(
      public activeModal: NgbActiveModal,
      public globals: Globals) {

  }

  ngOnInit() {
  }
}
