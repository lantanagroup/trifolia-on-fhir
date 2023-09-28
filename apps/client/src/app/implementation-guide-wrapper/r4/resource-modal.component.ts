import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuide, ImplementationGuideResourceComponent} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {FhirReferenceModalComponent, ResourceSelection} from '../../fhir-edit/reference-modal/reference-modal.component';
import {parseReference} from '../../../../../../libs/tof-lib/src/lib/helper';
import {FhirResourceService} from '../../shared/fhir-resource.service';
import {Globals} from '@trifolia-fhir/tof-lib';

@Component({
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.css']
})
export class R4ResourceModalComponent {
  @Input() resource: ImplementationGuideResourceComponent;
  @Input() implementationGuide: ImplementationGuide;
  @Input() implementationGuideID: string;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private fhirResourceService: FhirResourceService) {

  }

  get resourceFormat() {
    const ext = (this.resource.extension || []).find(e => e.url === Globals.igResourceFormatExtensionUrl);
    return ext ? ext.valueCode || '' : '';
  }

  set resourceFormat(value: string) {
    this.resource.extension = this.resource.extension || [];
    let ext = this.resource.extension.find(e => e.url === Globals.igResourceFormatExtensionUrl);

    if (!ext) {
      ext = {
        url: Globals.igResourceFormatExtensionUrl
      };
      this.resource.extension.push(ext);
    }

    ext.valueCode = value;
  }

  get enableGroups() {
    return this.resource.groupingId ||
      (this.implementationGuide.definition.grouping && this.implementationGuide.definition.grouping.length > 0);
  }

  get enableExampleCanonical() {
    return this.resource.exampleCanonical || !this.resource.hasOwnProperty('exampleBoolean');
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
        results = await this.fhirResourceService.search(1, null, 'r4', this.implementationGuideID, parsedReference.resourceType, null, null, parsedReference.id).toPromise();
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
