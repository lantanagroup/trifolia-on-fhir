import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import type {IDomainResource} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {FhirService} from '../../shared/fhir.service';

@Component({
  selector: 'trifolia-fhir-update-diff',
  templateUrl: './update-diff.component.html',
  styleUrls: ['./update-diff.component.css']
})
export class UpdateDiffComponent implements OnInit {
  @Input() importResource: IDomainResource;
  currentResource: IDomainResource;
  message: string;
  showJson = false;
  left: string;
  right: string;

  constructor(public activeModal: NgbActiveModal, private fhirService: FhirService) { }

  reSerialize() {
    if (!this.currentResource || !this.importResource) return;

    if (!this.showJson) {
      this.left = this.fhirService.serialize(this.currentResource).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      this.right = this.fhirService.serialize(this.importResource).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    } else {
      this.left = JSON.stringify(this.currentResource, null, '\t');
      this.right = JSON.stringify(this.importResource, null, '\t');
    }
  }

  async ngOnInit() {
    if (this.importResource) {
      this.importResource = JSON.parse(JSON.stringify(this.importResource));
      delete this.importResource.meta;

      this.message = 'Loading differences...';
      this.currentResource = <IDomainResource>await this.fhirService.read(this.importResource.resourceType, this.importResource.id).toPromise();
      this.message = null;

      if (this.currentResource) {
        delete this.currentResource.meta;
      }

      this.reSerialize();
    }
  }
}
