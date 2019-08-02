import {Component, Input, OnInit} from '@angular/core';
import {Range} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-range-modal',
  templateUrl: './range-modal.component.html',
  styleUrls: ['./range-modal.component.css']
})
export class FhirRangeModalComponent implements OnInit {
  @Input() range: Range;

  public Globals = Globals;

  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
  }
}
