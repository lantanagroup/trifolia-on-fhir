import {Component, OnInit, ViewChild} from '@angular/core';
import {FhirService} from '../shared/fhir.service';
import {Bundle, Coding, DomainResource, OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {saveAs} from 'file-saver';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal, NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../shared/config.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';

class OpenedResource {
  resource: DomainResource;
  activeSub: 'json'|'xml'|'permissions' = 'json';

  constructor(resource) {
    this.resource = resource;
  }
}

@Component({
  templateUrl: './other-resources.component.html',
  styleUrls: ['./other-resources.component.css']
})
export class OtherResourcesComponent implements OnInit {
  public resourceTypes: Coding[];
  public searchResourceType: string;
  public searchContent: string;
  public searchUrl: string;
  public message: string;
  public openedResources: OpenedResource[] = [];
  public results: Bundle;
  public Globals = Globals;

  @ViewChild('tabSet')
  public tabSet: NgbTabset;

  constructor(
    private configService: ConfigService,
    private fhirService: FhirService,
    private modalService: NgbModal) {
  }

  public search() {
    if (!this.searchResourceType) {
      return;
    }

    this.message = 'Searching...';

    this.fhirService.search(this.searchResourceType, this.searchContent, true, this.searchUrl)
      .subscribe((results: Bundle) => {
        this.results = results;
        this.message = 'Done searching...';
        this.tabSet.select('results');
      }, (err) => {
        this.message = 'Error while searching for other resources: ' + getErrorString(err);
      });
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
        const index = this.openedResources.indexOf(or);
        this.closeResource(index);
      }, (err) => {
        this.message = 'Error while removing the resource: ' + getErrorString(err);
      });
  }

  public changeId(or: OpenedResource) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
    modalRef.componentInstance.resourceType = or.resource.resourceType;
    modalRef.componentInstance.originalId = or.resource.id;
    modalRef.result.then((newId) => {
      // Update the search results to reflect the new id
      const foundEntry = (this.results.entry || []).find((entry) => entry.resource.id === or.resource.id);
      if (foundEntry) {
        foundEntry.resource.id = newId;
      }

      // Update the resource that's opened in a separate tab to reflect the new id
      or.resource.id = newId;
    });
  }

  public downloadFile(type: 'xml' | 'json', openedResourcesIndex: number) {
    const openedResource = this.openedResources[openedResourcesIndex];

    switch (type) {
      case 'xml':
        const xml = this.fhirService.serialize(openedResource.resource);
        const xmlBlob = new Blob([xml], {type: 'application/xml'});
        saveAs(xmlBlob, openedResource.resource.id + '.xml');
        break;
      case 'json':
        const json = JSON.stringify(openedResource.resource, null, '\t');
        const jsonBlob = new Blob([json], {type: 'application/json'});
        saveAs(jsonBlob, openedResource.resource.id + '.json');
        break;
    }
  }

  public uploadFile(type: 'xml' | 'json', openedResourcesIndex: number, event: any, fileInput: any) {
    const reader = new FileReader();
    const openedResource = this.openedResources[openedResourcesIndex];

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
        fileInput.value = null;

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

  public closeResource(index, event?) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.tabSet.select('results');
    this.openedResources.splice(index, 1);
  }

  public getEntryUrl(entry) {
    if (entry && entry.resource && entry.resource.url) {
      return entry.url;
    }

    return '';
  }

  public getEntryName(entry) {
    if (entry && entry.resource) {
      const resource = entry.resource;

      if (resource.title) {
        return resource.title;
      }

      if (resource.name) {
        if (typeof resource.name === 'string') {
          return resource.name;
        } else if (resource.name instanceof Array && resource.name.length > 0) {
          if (resource.name[0].text) {
            return resource.name[0].text;
          }

          let retName = '';

          if (resource.name[0].given) {
            retName = resource.name[0].given.join(' ');
          }

          if (resource.name[0].family) {
            retName += ' ' + resource.name[0].family;
          }

          return retName;
        }
      }
    }
  }

  changeSubTab(or: OpenedResource, event: NgbTabChangeEvent) {
    or.activeSub = <any> event.nextId;
  }

  openResource(resource) {
    this.message = 'Opening resource';

    this.fhirService.read(resource.resourceType, resource.id)
      .subscribe((results: DomainResource) => {
        const found = this.openedResources.find((next) => next.resource.id === resource.id);

        if (found) {
          const index = this.openedResources.indexOf(found);
          this.openedResources.splice(index, 1);
        }

        this.openedResources.push(new OpenedResource(results));

        setTimeout(() => {
          this.message = 'Resource opened.';
          this.tabSet.select('resource-' + (this.openedResources.length - 1));
        }, 100);
      }, (err) => {
        this.message = 'Error opening resource: ' + getErrorString(err);
      });
  }

  ngOnInit() {
    this.resourceTypes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
  }
}
