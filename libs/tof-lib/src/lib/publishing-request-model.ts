import {INonFhirResource, IProjectResourceReference, NonFhirResource, PublicationRequest} from '@trifolia-fhir/models';

export class PublishingRequestModel {
  'package-id': string;
  version: string;
  path: string;
  milestone: boolean;
  status: string;
  sequence: string;
  desc?: string;
  descmd?: string;
  changes?: string;
  title?: string;
  'ci-build'?: string;
  introduction?: string;
  category?: string;

  /*public static findContainedDocumentReference(implementationGuide: IImplementationGuide) {
    const found = <R4DocumentReference>implementationGuide.contained
      .find((c) => {
        if (c.resourceType === 'DocumentReference') {
          const dr = <R4DocumentReference>c;
          return dr.type && dr.type.coding && dr.type.coding.length > 0 && dr.type.coding[0].code === 'publication-request';
        }

        return false;
      });

    return found;
  }*/

  /*public static removePublishingRequest(implementationGuide: IImplementationGuide) {
    const found = PublishingRequestModel.findContainedDocumentReference(implementationGuide);

    if (found) {
      const index = implementationGuide.contained.indexOf(found);
      implementationGuide.contained.splice(index, 1);

      if (implementationGuide.contained.length === 0) {
        delete implementationGuide.contained;
      }
    }

    const ext = (implementationGuide.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-publication-request'] && e.valueReference && e.valueReference.reference === '#publication-request');

    if (ext) {
      const index = implementationGuide.extension.indexOf(ext);
      implementationGuide.extension.splice(index, 1);

      if (implementationGuide.extension.length === 0) {
        delete implementationGuide.extension;
      }
    }
  }*/

  public static getPublishingRequest(fhirResource: any) {
   /* if (!implementationGuide || !implementationGuide.contained) {
      return;
    }

    const found = this.findContainedDocumentReference(implementationGuide);

    if (found && found.content.length > 0 && found.content[0].attachment && found.content[0].attachment.data) {
      const decoded = typeof atob !== 'undefined' ? atob(found.content[0].attachment.data) : Buffer.from(found.content[0].attachment.data, 'base64').toString();

      try {
        const publishingRequest = new PublishingRequestModel();
        Object.assign(publishingRequest, JSON.parse(decoded));
        return publishingRequest;
      } catch (ex) {
      }
    }*/
    let content = "";
    const publishingRequestIndex = (fhirResource.references || []).findIndex((r: IProjectResourceReference) => r.valueType == NonFhirResource.name && typeof r.value == typeof {} && (<INonFhirResource>r.value).type === PublicationRequest.name)
    if (publishingRequestIndex > -1) {
      let pr = fhirResource.references[publishingRequestIndex].value as PublicationRequest;
      content = pr.content;
    }
    return JSON.parse(content);
  }

  // FINISH THIS, CHECK TOF TO SEE HOW USED
 /* public static setPublishingRequest(implementationGuide: IImplementationGuide, publishingRequest: PublishingRequestModel, fhirVersion: Versions) {
    if (!implementationGuide) return;

    implementationGuide.contained = implementationGuide.contained || [];
    let found: IDocumentReference = this.findContainedDocumentReference(implementationGuide);

    if (!found) {
      if (fhirVersion === Versions.STU3) {
        found = new STU3DocumentReference();
      } else if (fhirVersion === Versions.R4) {
        found = new R4DocumentReference();
      } else if (fhirVersion === Versions.R5) {
        found = new R5DocumentReference();
      }

      found.type = {
        coding: [{
          code: 'publication-request'
        }]
      };
      found.content = [{
        attachment: {
          contentType: 'application/json'
        }
      }];
      implementationGuide.contained.push(found);
    }

    found.id = 'publication-request';
    found.status = 'current';

    if (fhirVersion === Versions.STU3) {
      (<STU3DocumentReference>found).indexed = (new Date()).toISOString();
    }

    if (!found.content || found.content.length === 0) {
      found.content = [{
        attachment: {
          contentType: 'application/json'
        }
      }];
    }

    if (!found.content[0].attachment) {
      found.content[0].attachment = {
        contentType: 'application/json'
      };
    }

    const json = JSON.stringify(publishingRequest, null, '\t');
    found.content[0].attachment.data = typeof btoa !== 'undefined' ? btoa(json) : Buffer.from(json).toString('base64');

    implementationGuide.extension = implementationGuide.extension || [];
    let ext = implementationGuide.extension.find(e => e.url === Globals.extensionUrls['extension-ig-publication-request'] && e.valueReference && e.valueReference.reference === '#publication-request');

    if (!ext) {
      ext = {
        url: Globals.extensionUrls['extension-ig-publication-request'],
        valueReference: {
          reference: '#publication-request'
        }
      };
      implementationGuide.extension.push(ext);
    }
  }*/


}


