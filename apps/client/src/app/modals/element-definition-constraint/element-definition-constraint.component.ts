import { Component, OnInit } from '@angular/core';
import {IElementDefinitionConstraint} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trifolia-fhir-element-definition-constraint',
  templateUrl: './element-definition-constraint.component.html',
  styleUrls: ['./element-definition-constraint.component.css']
})
export class ElementDefinitionConstraintComponent implements OnInit {
  constraint: IElementDefinitionConstraint;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
}
