import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuide, PackageResourceComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {
  getDefaultImplementationGuideResourcePath,
  getExtensionString, parseUrl,
  setExtensionString
} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';

@Component({
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.css']
})
export class STU3ResourceModalComponent {
  @Input() resource: PackageResourceComponent;
  @Input() implementationGuide: ImplementationGuide;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) {

  }

  ok() {
    this.activeModal.close();
  }
}
