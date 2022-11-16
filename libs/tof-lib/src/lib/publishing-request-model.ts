import { DocumentReference as R4DocumentReference } from './r4/fhir';
import { DocumentReference as STU3DocumentReference } from './stu3/fhir';
import { IImplementationGuide } from './fhirInterfaces';
import { Globals } from './globals';
import { Versions } from 'fhir/fhir';

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
  'ci-build?': string;
  introduction?: string;
  category?: string;

  public static findContainedDocumentReference(implementationGuide: IImplementationGuide) {
    const found = <R4DocumentReference>implementationGuide.contained
      .find((c) => {
        if (c.resourceType === 'DocumentReference') {
          const dr = <R4DocumentReference>c;
          return dr.type && dr.type.coding && dr.type.coding.length > 0 && dr.type.coding[0].code === 'package-list';
        }

        return false;
      });

    return found;
  }

  public static removePublishingRequest(implementationGuide: IImplementationGuide) {
    const found = PublishingRequestModel.findContainedDocumentReference(implementationGuide);

    if (found) {
      const index = implementationGuide.contained.indexOf(found);
      implementationGuide.contained.splice(index, 1);

      if (implementationGuide.contained.length === 0) {
        delete implementationGuide.contained;
      }
    }

    const ext = (implementationGuide.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-publishing-request'] && e.valueReference && e.valueReference.reference === '#publishing-request');

    if (ext) {
      const index = implementationGuide.extension.indexOf(ext);
      implementationGuide.extension.splice(index, 1);

      if (implementationGuide.extension.length === 0) {
        delete implementationGuide.extension;
      }
    }
  }

  public static getPublishingRequest(implementationGuide: IImplementationGuide) {
    if (!implementationGuide || !implementationGuide.contained) {
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
    }
  }

  // FINISH THIS, CHECK TOF TO SEE HOW USED
  public static setPublishingRequest(implementationGuide: IImplementationGuide, publishingRequest: PublishingRequestModel, fhirVersion: Versions) {
    if (!implementationGuide) return;

    implementationGuide.contained = implementationGuide.contained || [];
    let found: STU3DocumentReference | R4DocumentReference = this.findContainedDocumentReference(implementationGuide);

    if (!found) {
      if (fhirVersion === Versions.STU3) {
        found = new STU3DocumentReference();
      } else if (fhirVersion === Versions.R4) {
        found = new R4DocumentReference();
      }

      found.type = {
        coding: [{
          code: 'publishing-request'
        }]
      };
      found.content = [{
        attachment: {
          contentType: 'application/json'
        }
      }];
      implementationGuide.contained.push(found);
    }

    found.id = 'publishing-request';
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
    let ext = implementationGuide.extension.find(e => e.url === Globals.extensionUrls['extension-ig-publishing-request'] && e.valueReference && e.valueReference.reference === '#publishing-request');

    if (!ext) {
      ext = {
        url: Globals.extensionUrls['extension-ig-publishing-request'],
        valueReference: {
          reference: '#publishing-request'
        }
      };
      implementationGuide.extension.push(ext);
    }
  }


}


