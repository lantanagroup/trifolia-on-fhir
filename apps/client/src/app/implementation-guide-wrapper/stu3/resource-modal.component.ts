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
export class STU3ResourceModalComponent implements OnInit {
  @Input() resource: PackageResourceComponent;
  @Input() implementationGuide: ImplementationGuide;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) {

  }

  sourceReferenceChanged() {
    if (this.resource.sourceReference) {
      this.filePath = getDefaultImplementationGuideResourcePath(this.resource.sourceReference);
    } else if (!this.resource.sourceUri) {
      this.filePath = null;
    }
  }

  sourceUriChanged() {
    if (this.resource.sourceUri) {
      let newFilePath = this.resource.sourceUri;

      if (newFilePath.lastIndexOf('/') > 0) {
        newFilePath = newFilePath.substring(newFilePath.lastIndexOf('/') + 1);
      }

      if (newFilePath.lastIndexOf('.') > 0) {
        newFilePath = newFilePath.substring(0, newFilePath.lastIndexOf('.'));
      }

      this.filePath = newFilePath + '.xml';
    } else if (!this.resource.sourceReference) {
      this.filePath = null;
    }
  }

  ok() {
    this.activeModal.close();
  }

  ngOnInit() {
    if (this.resource.sourceReference && !this.filePath) {
      this.sourceReferenceChanged();
    } else if (this.resource.sourceUri && !this.filePath) {
      this.sourceUriChanged();
    }
  }
}
