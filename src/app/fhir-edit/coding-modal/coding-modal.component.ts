import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {Coding} from '../../models/stu3/fhir';

@Component({
  selector: 'app-fhir-coding-modal',
  templateUrl: './coding-modal.component.html',
  styleUrls: ['./coding-modal.component.css']
})
export class FhirCodingModalComponent implements OnInit {
  @Input() coding: Coding;

  constructor(
      public activeModal: NgbActiveModal,
      public globals: Globals) {

  }

  ngOnInit() {
  }

}
