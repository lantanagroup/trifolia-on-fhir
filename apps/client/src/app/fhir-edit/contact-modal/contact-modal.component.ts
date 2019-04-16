import {Component, Input, OnInit} from '@angular/core';
import {ContactDetail} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';

@Component({
  selector: 'app-fhir-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.css']
})
export class FhirContactModalComponent implements OnInit {
  @Input() contact: ContactDetail;

  public Globals = Globals;

  constructor(
      public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
  }

}
