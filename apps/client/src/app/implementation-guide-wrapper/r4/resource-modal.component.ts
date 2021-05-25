import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ImplementationGuide,
  ImplementationGuideResourceComponent
} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {
  getDefaultImplementationGuideResourcePath,
  getExtensionString,
  setExtensionString
} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {
  FhirReferenceModalComponent,
  ResourceSelection
} from '../../fhir-edit/reference-modal/reference-modal.component';
import {parseReference} from '../../../../../../libs/tof-lib/src/lib/helper';
import {FhirService} from '../../shared/fhir.service';

@Component({
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.css']
})
export class R4ResourceModalComponent {
  @Input() resource: ImplementationGuideResourceComponent;
  @Input() implementationGuide: ImplementationGuide;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private fhirService: FhirService) {

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
    })
  }

  async copyDescription() {
    try {
      const parsedReference = parseReference(this.resource.reference.reference);
      const results: any = await this.fhirService.read(parsedReference.resourceType, parsedReference.id).toPromise();

      if (results) {
        if (results.description) {
          this.resource.description = results.description;
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
