import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Coding, ConceptReferenceComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ClientHelper} from '../../clientHelper';

@Component({
  selector: 'app-fhir-value-set-include-concept-modal',
  templateUrl: './value-set-include-concept-modal.component.html',
  styleUrls: ['./value-set-include-concept-modal.component.css']
})
export class FhirValueSetIncludeConceptModalComponent implements OnInit {
  @Input() concept: ConceptReferenceComponent;
  public ClientHelper = ClientHelper;
  public uses: Coding[] = [{
    code: '900000000000003001',
    display: 'Fully specified name',
    system: 'http://snomed.info/sct'
  }, {
    code: '900000000000013009',
    display: 'Synonym',
    system: 'http://snomed.info/sct'
  }];

  constructor(
    public activeModal: NgbActiveModal) {
  }

  addDesignation() {
    this.concept.designation = this.concept.designation || [];
    this.concept.designation.push({
      value: ''
    });
  }

  ngOnInit() {
    if (this.concept) {
      (this.concept.designation || []).forEach(d => {
        if (d.use) {
          const foundUse = this.uses.find(u => u.code === d.use.code && u.system === d.use.system);

          if (foundUse) {
            if (!d.use.display) {
              d.use.display = foundUse.display;
            }

            // Update the element in the uses[] array to match the code selected, otherwise
            // the by-reference comparison in the select/dropdown won't match
            const foundUseIndex = this.uses.indexOf(foundUse);
            this.uses.splice(foundUseIndex, 1, d.use);
          }
        }
      });
    }
  }
}
