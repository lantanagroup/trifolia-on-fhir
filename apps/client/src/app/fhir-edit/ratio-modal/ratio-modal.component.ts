import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Ratio} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';

@Component({
  selector: 'app-fhir-edit-ratio-modal',
  templateUrl: './ratio-modal.component.html',
  styleUrls: ['./ratio-modal.component.css']
})
export class FhirRatioModalComponent implements OnInit {
  @Input() ratio: Ratio;

  public Globals = Globals;

  constructor(
    public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
  }
}
