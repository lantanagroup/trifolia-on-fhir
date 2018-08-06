import {Component, Input, OnInit} from '@angular/core';
import {CodeableConcept, Coding} from '../../models/stu3/fhir';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {FhirEditCodingModalComponent} from '../coding-modal/coding-modal.component';

@Component({
  selector: 'app-fhir-codeable-concept-modal',
  templateUrl: './codeable-concept-modal.component.html',
  styleUrls: ['./codeable-concept-modal.component.css']
})
export class FhirEditCodeableConceptModalComponent implements OnInit {
  @Input() codeableConcept: CodeableConcept;

  constructor(
      private modalService: NgbModal,
      public activeModal: NgbActiveModal,
      public globals: Globals) {

  }

  editCoding(coding: Coding) {
      const modalRef = this.modalService.open(FhirEditCodingModalComponent);
      modalRef.componentInstance.coding = coding;
  }

  ngOnInit() {
  }
}
