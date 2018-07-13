import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';

@Component({
  selector: 'app-fhir-element-definition-type-modal',
  templateUrl: './element-definition-type-modal.component.html',
  styleUrls: ['./element-definition-type-modal.component.css']
})
export class ElementDefinitionTypeModalComponent implements OnInit {
  @Input() element: any;
  @Input() type: any;

  constructor(public activeModal: NgbActiveModal, public globals: Globals) {
  }

  ngOnInit() {
  }
}
