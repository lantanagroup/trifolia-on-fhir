import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuide, ImplementationGuideResourceComponent} from '@trifolia-fhir/r4';
import {FhirReferenceModalComponent, ResourceSelection} from '../../fhir-edit/reference-modal/reference-modal.component';
import {parseReference} from '@trifolia-fhir/tof-lib';
import {ConformanceService} from '../../shared/conformance.service';

@Component({
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.css']
})
export class R5ResourceModalComponent {
  @Input() resource: ImplementationGuideResourceComponent;
  @Input() implementationGuide: ImplementationGuide;
  @Input() implementationGuideID: string;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private conformanceService: ConformanceService) {

  }

  get enableGroups() {
    return this.resource.groupingId ||
      (this.implementationGuide.definition.grouping && this.implementationGuide.definition.grouping.length > 0);
  }

  get enableExampleCanonical() {
    return this.resource.exampleCanonical || !this.resource.hasOwnProperty('exampleBoolean');
  }


  get isDescriptionRequired() {
    return !this.resource.description && ((this.resource.hasOwnProperty('exampleBoolean') && this.resource.exampleBoolean === true) || (this.resource.hasOwnProperty('exampleCanonical') && this.resource.exampleCanonical !== ''));
  }

  exampleBooleanChanged() {
    if (this.resource.hasOwnProperty('exampleCanonical')) {
      delete this.resource.exampleCanonical;
    }
  }

  removeExampleCanonical() {
    delete this.resource.exampleCanonical;
    this.resource.exampleBoolean = true;
  }

  selectExampleCanonical() {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resourceType = 'StructureDefinition';
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((result: ResourceSelection) => {
      if (this.resource.hasOwnProperty('exampleBoolean')) {
        delete this.resource.exampleBoolean;
      }

      this.resource.exampleCanonical = result.resource.url;
    });
  }

  async copyDescription() {
    try {
      let results: any = [];
      let result = [];
      const parsedReference = parseReference(this.resource.reference.reference);
      if (parsedReference.resourceType !== 'Binary') {
        results = await this.conformanceService.search(1, null, 'r4', this.implementationGuideID, parsedReference.resourceType, null, null, parsedReference.id).toPromise();
        result = results.results;
      }
      else{
        alert('The target resource does not have a "Description"');
      }
      if (result.length > 0) {
        if (result[0].resource.description) {
          this.resource.description = result[0].resource.description;
        } else {
          alert('The target resource does not have a "Description"');
        }
      }
    } catch (ex) {
      alert(`Failed to load resource to copy the description: ${ex.message}`);
    }
  }

  ok() {
    this.activeModal.close();
  }
}
