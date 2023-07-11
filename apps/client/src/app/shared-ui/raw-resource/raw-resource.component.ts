import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FhirService} from '../../shared/fhir.service';
import {saveAs} from 'file-saver';
import * as vkbeautify from 'vkbeautify';
import {IDomainResource} from '@trifolia-fhir/tof-lib';

@Component({
  selector: 'app-raw-resource',
  templateUrl: './raw-resource.component.html',
  styleUrls: ['./raw-resource.component.css']
})
export class RawResourceComponent {
  @Input() shown?: boolean;
  @Input() resource: IDomainResource;
  @Output() resourceChange = new EventEmitter<IDomainResource>();

  constructor(private fhirService: FhirService) {
  }

  public get baseFileName() {
    if (this.resource  && this.resource.id) {
      return this.resource.id;
    }

    return 'resource';
  }

  public downloadJson(event?) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const blob = new Blob([JSON.stringify(this.resource, null, '\t')], { type: 'application/json; charset=utf-8' });
    saveAs(blob, this.baseFileName + '.json');
  }

  public downloadXml(event?) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const resourceXml = this.fhirService.serialize(this.resource);
    const blob = new Blob([resourceXml], { type: 'text/xml; charset=utf-8' });
    saveAs(blob, this.baseFileName + '.xml');
  }

  public get xml() {
    if (!this.resource) {
      return;
    }

    const xml = this.fhirService.serialize(this.resource);

    return xml ? vkbeautify.xml(xml) : '';
  }

  uploadJson(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const result = e.target.result;

      try {
        const obj = JSON.parse(result);

        if (!obj || !obj.resourceType) {
          alert('JSON is not a FHIR resource');
          return;
        }

        if (this.resource.resourceType !== obj.resourceType) {
          alert(`Uploaded resource's type does not match`);
        }

        if (this.resource.id && this.resource.id !== obj.id) {
          alert(`Uploaded resource's ID does not match`);
          return;
        }

        Object.assign(this.resource, obj);
        this.resourceChange.emit(this.resource);
      } catch (ex) {
        alert('Error parsing JSON as FHIR');
        console.error(ex);
      }
    };
    reader.readAsText(file);
  }

  uploadXml(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const result = e.target.result;

      try {
        const obj: any = this.fhirService.deserialize(result);

        if (!obj || !obj.resourceType) {
          alert('XML is not a FHIR resource');
          return;
        }

        if (this.resource.resourceType !== obj.resourceType) {
          alert(`Uploaded resource's type does not match`);
        }

        if (this.resource.id && this.resource.id !== obj.id) {
          alert(`Uploaded resource's ID does not match`);
          return;
        }

        Object.assign(this.resource, obj);
        this.resourceChange.emit(this.resource);
      } catch (ex) {
        alert('Error parsing XML as FHIR');
        console.error(ex);
      }
    };
    reader.readAsText(file);
  }
}
