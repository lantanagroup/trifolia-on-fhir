import {Component, Input, OnInit} from '@angular/core';
import {ResourceComponent} from '../../models/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';

@Component({
  selector: 'app-fhir-capability-statement-resource-modal',
  templateUrl: './capability-statement-resource-modal.component.html',
  styleUrls: ['./capability-statement-resource-modal.component.css']
})
export class FhirEditCapabilityStatementResourceModalComponent implements OnInit {
    @Input() resource: ResourceComponent;

    constructor(
        public activeModal: NgbActiveModal,
        public globals: Globals) {

    }

  ngOnInit() {
  }

}
