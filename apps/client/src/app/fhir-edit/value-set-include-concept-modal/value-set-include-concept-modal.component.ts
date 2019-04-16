import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {ConceptReferenceComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';

@Component({
  selector: 'app-fhir-value-set-include-concept-modal',
  templateUrl: './value-set-include-concept-modal.component.html',
  styleUrls: ['./value-set-include-concept-modal.component.css']
})
export class FhirValueSetIncludeConceptModalComponent implements OnInit {
  @Input() concept: ConceptReferenceComponent;

  public Globals = Globals;

  constructor(
    public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
