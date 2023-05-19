import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import type { IDomainResource } from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { FhirService } from '../../shared/fhir.service';

@Component({
  selector: 'trifolia-fhir-update-diff',
  templateUrl: './update-diff.component.html',
  styleUrls: ['./update-diff.component.css']
})
export class UpdateDiffComponent implements OnInit {
  @Input() importResource: any;
  @Input() existingResource: any;
  message: string;
  showJson = false;
  canSerialize = false;
  left: string;
  right: string;

  constructor(public activeModal: NgbActiveModal, private fhirService: FhirService) { }

  reSerialize() {
    if (!this.existingResource || !this.importResource) return;

    if (!this.showJson && this.canSerialize) {
      this.left = this.fhirService.serialize(this.existingResource);//.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      this.right = this.fhirService.serialize(this.importResource);//.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    } else {
      this.left = (typeof this.existingResource === typeof '') ? this.existingResource : JSON.stringify(this.existingResource, null, '\t');
      this.right = (typeof this.importResource === typeof '') ? this.importResource : JSON.stringify(this.importResource, null, '\t');
    }
  }

  async ngOnInit() {
    this.canSerialize = false;

    if (this.importResource) {

      let resourceString: string = this.importResource;

      if (typeof this.importResource !== typeof '') {
        resourceString = JSON.stringify(this.importResource);
      }

      try {
        this.importResource = JSON.parse(resourceString);
        this.canSerialize = true;
      } catch (error) {
        this.importResource = resourceString;
        this.canSerialize = false;
      }

      Object.keys(this.importResource.meta || []).forEach(k => { if (k !== 'profile') { delete this.importResource.meta[k]; } });

      this.message = 'Loading differences...';
      this.message = null;

      if (this.existingResource) {
        Object.keys(this.existingResource.meta || []).forEach(k => { if (k !== 'profile') { delete this.existingResource.meta[k]; } });
      }

      this.reSerialize();
    }
  }
}
