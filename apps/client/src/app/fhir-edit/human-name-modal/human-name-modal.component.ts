import {Component, Input, OnInit} from '@angular/core';
import {HumanName} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';

@Component({
  selector: 'app-fhir-human-name-modal',
  templateUrl: './human-name-modal.component.html',
  styleUrls: ['./human-name-modal.component.css']
})
export class FhirHumanNameModalComponent implements OnInit {
  @Input() humanName: HumanName;

  public Globals = Globals;

  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
  }

}
