import {Component, Input, OnInit} from '@angular/core';
import {CodeableConcept, Coding} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {FhirCodingModalComponent} from '../coding-modal/coding-modal.component';

@Component({
  selector: 'app-fhir-codeable-concept-modal',
  templateUrl: './codeable-concept-modal.component.html',
  styleUrls: ['./codeable-concept-modal.component.css']
})
export class FhirCodeableConceptModalComponent implements OnInit {
  @Input() codeableConcept: CodeableConcept;

  public Globals = Globals;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {

  }

  editCoding(coding: Coding) {
    const modalRef = this.modalService.open(FhirCodingModalComponent);
    modalRef.componentInstance.coding = coding;
  }

  ngOnInit() {
  }
}
