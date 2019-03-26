import {Component, OnInit, ViewChild} from '@angular/core';
import {FhirService} from '../shared/fhir.service';
import {Bundle, Coding, DomainResource, OperationOutcome, Resource} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {saveAs} from 'file-saver';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal, NgbTabset} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-other-resources',
    templateUrl: './other-resources.component.html',
    styleUrls: ['./other-resources.component.css']
})
export class OtherResourcesComponent implements OnInit {
    public resourceTypes: Coding[];
    public searchResourceType: string;
    public searchContent: string;
    public searchUrl: string;
    public message: string;
    public openedResources: DomainResource[] = [];
    public results: Bundle;

    @ViewChild('tabSet')
    public tabSet: NgbTabset;

    constructor(
        private fhirService: FhirService,
        private modalService: NgbModal) {
    }

    public search() {
        this.message = 'Searching...';

        this.fhirService.search(this.searchResourceType, this.searchContent, true, this.searchUrl)
            .subscribe((results: Bundle) => {
                this.results = results;
                this.message = 'Done searching...';
                this.tabSet.select('results');
            }, (err) => {
                this.message = 'Error while searching for other resources: ' + this.fhirService.getErrorString(err);
            });
    }

    public remove(resource: DomainResource) {
        this.fhirService.delete(resource.resourceType, resource.id)
            .subscribe(() => {
                const index = this.openedResources.indexOf(resource);
                this.closeResource(index);
            }, (err) => {
                this.message = 'Error while removing the resource: ' + this.fhirService.getErrorString(err);
            });
    }

    public changeId(resource: DomainResource) {
        const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
        modalRef.componentInstance.resourceType = resource.resourceType;
        modalRef.componentInstance.originalId = resource.id;
        modalRef.result.then((newId) => {
            // Update the search results to reflect the new id
            const foundEntry = _.find(this.results.entry, (entry) => entry.resource.id === resource.id);
            if (foundEntry) {
                foundEntry.resource.id = newId;
            }

            // Update the resource that's opened in a separate tab to reflect the new id
            resource.id = newId;
        });
    }

    public downloadFile(type: 'xml'|'json', openedResourcesIndex: number) {
        const openedResource = this.openedResources[openedResourcesIndex];

        switch (type) {
            case 'xml':
                const xml = this.fhirService.serialize(openedResource);
                const xmlBlob = new Blob([xml], {type: 'application/xml'});
                saveAs(xmlBlob, openedResource.id + '.xml');
                break;
            case 'json':
                const json = JSON.stringify(openedResource, null, '\t');
                const jsonBlob = new Blob([json], {type: 'application/json'});
                saveAs(jsonBlob, openedResource.id + '.json');
                break;
        }
    }

    public uploadFile(type: 'xml'|'json', openedResourcesIndex: number, event: any, fileInput: any) {
        const reader = new FileReader();
        const openedResource = this.openedResources[openedResourcesIndex];

        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.onload = () => {
                const content = <string> reader.result;
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

                this.fhirService.update(resource.resourceType, openedResource.id, resource)
                    .subscribe((result: DomainResource) => {
                        if (result.resourceType === openedResource.resourceType) {
                            Object.assign(openedResource, result);
                            this.message = 'Updated resource';
                        } else if (result.resourceType === 'OperationOutcome') {
                            this.message = this.fhirService.getOperationOutcomeMessage(<OperationOutcome> result);

                            this.fhirService.read(openedResource.resourceType, openedResource.id)
                                .subscribe((updatedResource: DomainResource) => {
                                    Object.assign(openedResource, updatedResource);
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

    openResource(resource) {
        this.message = 'Opening resource';

        this.fhirService.read(resource.resourceType, resource.id)
            .subscribe((results: DomainResource) => {
                const found = _.find(this.openedResources, (next) => next.id === resource.id);

                if (found) {
                    const index = this.openedResources.indexOf(found);
                    this.openedResources.splice(index, 1);
                }

                this.openedResources.push(results);

                setTimeout(() => {
                    this.message = 'Resource opened.';
                    this.tabSet.select('resource-' + (this.openedResources.length - 1));
                }, 100);
            }, (err) => {
                this.message = 'Error opening resource: ' + this.fhirService.getErrorString(err);
            });
    }

    ngOnInit() {
        this.resourceTypes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    }
}
