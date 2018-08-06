import {Component, Input, OnInit} from '@angular/core';
import {ConceptSetComponent} from '../../models/stu3/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';

@Component({
  selector: 'app-valueset-include-modal',
  templateUrl: './valueset-include-modal.component.html',
  styleUrls: ['./valueset-include-modal.component.css']
})
export class FhirEditValuesetIncludeModalComponent implements OnInit {
  @Input() include: ConceptSetComponent;

  constructor(
      public activeModal: NgbActiveModal,
      public globals: Globals) {

  }

  ngOnInit() {
  }
}
