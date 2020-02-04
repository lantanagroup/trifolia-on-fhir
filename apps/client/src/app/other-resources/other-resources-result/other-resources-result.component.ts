import { Component, EventEmitter, OnInit } from '@angular/core';
import { FhirService } from '../../shared/fhir.service';
import { ActivatedRoute } from '@angular/router';
import { DomainResource, OperationOutcome } from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { getErrorString } from '../../../../../../libs/tof-lib/src/lib/helper';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import {saveAs} from 'file-saver';
import { ChangeResourceIdModalComponent } from '../../modals/change-resource-id-modal/change-resource-id-modal.component';
import { ConfigService } from '../../shared/config.service';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import { ValidatorResponse } from 'fhir/validator';

class OpenedResource {
  resource: DomainResource;
  activeSub: 'json/xml'|'permissions' = 'json/xml';

  constructor(resource) {
    this.resource = resource;
  }
}

@Component({
  templateUrl: './other-resources-result.component.html',
  styleUrls: ['./other-resources-result.component.css']
})
export class OtherResourcesResultComponent implements OnInit {
  message: string;
  data: OpenedResource;
  Globals = Globals;
  content: string;
  contentChanged = new EventEmitter();
  serializationError = false;
  validation: ValidatorResponse;
  selected: string = 'JSON';
  options: string[] = [ 'JSON', 'XML' ];

  constructor(private fhirService: FhirService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              public configService: ConfigService) {

    this.contentChanged
      .debounceTime(500)
      .subscribe(() => {
        if (this.data) {
          this.serializationError = false
          this.message = null;
          try {
            // deserialize the content back to data
            if (this.data.activeSub === 'json/xml' && this.selected === 'JSON') {
              this.data.resource = JSON.parse(this.content);
              this.message = 'The content has been updated';
            } else if (this.data.activeSub === 'json/xml' && this.selected === 'XML') {
              this.data.resource = this.fhirService.deserialize(this.content);
              this.message = 'The content has been updated';
            }

            this.validation = this.fhirService.validate(this.data.resource);

            if(!this.validation.valid){
              this.message = 'There are validation errors. This resource will still save but please view the validation tab.';
            }

            setTimeout(() => { this.message = ''; }, 3000);
          }
           catch (ex) {
            this.message = 'The content you have specified is invalid: ' + ex.message;
            //Deactivate save button when true
            this.serializationError = true;
          }
        }
      });
  }

  contentHasChanged(newValue: string) {
    this.content = newValue;
    this.contentChanged.emit();
  }

  ngOnInit() {
    this.message = 'Opening resource';

    this.fhirService.read(this.route.snapshot.params.type, this.route.snapshot.params.id)
      .subscribe((results: DomainResource) => {

        this.data = new OpenedResource(results);
        this.content = JSON.stringify(this.data.resource, null, '\t');
        this.validation = this.fhirService.validate(this.data.resource);

        setTimeout(() => {
          this.message = 'Resource opened.';
        }, 100);
      }, (err) => {
        this.message = 'Error opening resource: ' + getErrorString(err);
      });
  }

  changeType() {
    console.log('Changing content type');
    switch (this.selected) {
      case 'JSON':
        this.content = JSON.stringify(this.data.resource, null, '\t');
        break;
      case 'XML':
        this.content = this.fhirService.serialize(this.data.resource);
        break;
    }
  }

  changeSubTab(event: NgbTabChangeEvent) {
    this.data.activeSub = <any> event.nextId;
  }

  public downloadFile() {
    const openedResource = this.data;
    let type: string = this.selected;
    switch (type) {
      case 'XML':
        const xml = this.fhirService.serialize(openedResource.resource);
        const xmlBlob = new Blob([xml], {type: 'application/xml'});
        saveAs(xmlBlob, openedResource.resource.id + '.xml');
        break;
      case 'JSON':
        const json = JSON.stringify(openedResource.resource, null, '\t');
        const jsonBlob = new Blob([json], {type: 'application/json'});
        saveAs(jsonBlob, openedResource.resource.id + '.json');
        break;
    }
  }

  public uploadFile(event: any) {
    let type: string = this.selected;
    const reader = new FileReader();
    const openedResource = this.data;

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.onload = () => {
        const content = <string>reader.result;
        let resource: DomainResource;

        switch (type) {
          case 'json':
            resource = JSON.parse(content);
            break;
          case 'xml':
            resource = this.fhirService.deserialize(content);
            break;
          default:
            throw new Error('Unexpected type specified: ' + type);
        }

        this.message = 'Updating the resource';

        this.fhirService.update(resource.resourceType, openedResource.resource.id, resource)
          .subscribe((result: DomainResource) => {
            if (result.resourceType === openedResource.resource.resourceType) {
              Object.assign(openedResource, result);
              this.message = 'Updated resource';
            } else if (result.resourceType === 'OperationOutcome') {
              this.message = this.fhirService.getOperationOutcomeMessage(<OperationOutcome>result);

              this.fhirService.read(openedResource.resource.resourceType, openedResource.resource.id)
                .subscribe((updatedResource: DomainResource) => {
                  Object.assign(openedResource.resource, updatedResource);
                }, (err) => {
                  console.log('Error re-opening resource after update: ' + err);
                  this.message = 'Error re-opening resource after update';
                });
            }
          }, (err) => {
            console.log(err);
            this.message = 'Error updating resource';
          });
      };
      reader.readAsText(file);
    }
  }

  public save(or: OpenedResource) {
    this.fhirService.update(or.resource.resourceType, or.resource.id, or.resource).toPromise()
      .then((updated) => {
        Object.assign(or.resource, updated);
        this.message = `Successfully updated resource ${or.resource.resourceType}/${or.resource.id}!`;
      })
      .catch((err) => {
        this.message = getErrorString(err);
      });
  }

  public remove(or: OpenedResource) {
    if (!confirm(`Are you sure you want to delete ${or.resource.resourceType}/${or.resource.id}?`)) {
      return false;
  }

    this.fhirService.delete(or.resource.resourceType, or.resource.id)
      .subscribe(() => {
      }, (err) => {
        this.message = 'Error while removing the resource: ' + getErrorString(err);
      });
  }

  public changeId(or: OpenedResource) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
    modalRef.componentInstance.resourceType = or.resource.resourceType;
    modalRef.componentInstance.originalId = or.resource.id;
    modalRef.result.then((newId) => {
      // Update the resource
      this.data.resource.id = newId;
    });
  }
}
