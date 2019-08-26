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

@Component({
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.css']
})
export class R4ResourceModalComponent implements OnInit {
  @Input() resource: ImplementationGuideResourceComponent;
  @Input() implementationGuide: ImplementationGuide;

  get enablePackage() {
    return this.resource.package ||
      (this.implementationGuide.definition.package && this.implementationGuide.definition.package.length > 0);
  }

  get enableExampleCanonical() {
    return this.resource.exampleCanonical || !this.resource.hasOwnProperty('exampleBoolean');
  }

  get filePath() {
    return getExtensionString(this.resource, Globals.extensionUrls['extension-ig-resource-file-path']);
  }

  set filePath(value: string) {
    setExtensionString(this.resource, Globals.extensionUrls['extension-ig-resource-file-path'], value);
  }

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) {

  }

  exampleBooleanChanged() {
    if (this.resource.hasOwnProperty('exampleCanonical')) {
      delete this.resource.exampleCanonical;
    }
  }

  selectExampleCanonical() {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, { size: 'lg' });
    modalRef.componentInstance.resourceType = 'StructureDefinition';
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((result: ResourceSelection) => {
      if (this.resource.hasOwnProperty('exampleBoolean')) {
        delete this.resource.exampleBoolean;
      }

      this.resource.exampleCanonical = result.resource.url;
    })
  }

  referenceChanged() {
    this.filePath = getDefaultImplementationGuideResourcePath(this.resource.reference);
  }

  ok() {
    this.activeModal.close();
  }

  ngOnInit() {
    if (!this.filePath) {
      this.filePath = getDefaultImplementationGuideResourcePath(this.resource.reference);
    }
  }
}
