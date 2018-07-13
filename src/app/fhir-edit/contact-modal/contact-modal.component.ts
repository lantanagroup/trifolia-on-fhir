import {Component, Input, OnInit} from '@angular/core';
import {ContactDetail} from '../../models/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';

@Component({
  selector: 'app-fhir-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.css']
})
export class ContactModalComponent implements OnInit {
  @Input() contact: ContactDetail;

  constructor(
      public activeModal: NgbActiveModal,
      public globals: Globals) {

  }

  ngOnInit() {
  }

}
