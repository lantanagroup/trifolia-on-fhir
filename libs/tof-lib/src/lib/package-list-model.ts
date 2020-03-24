import {DocumentReference as R4DocumentReference} from './r4/fhir';
import {DocumentReference as STU3DocumentReference} from './stu3/fhir';
import {IImplementationGuide} from './fhirInterfaces';
import {Globals} from './globals';
import {Versions} from 'fhir/fhir';

export class PackageListItemModel {
  version = 'current';
  date?: string;
  desc: string;
  path: string;
  changes?: string;
  status: string;
  sequence?: string;
  fhirversion: string;
  'sub-packages'?: string[];
  current? = true;
}

export class PackageListModel {
  'package-id': string;
  title: string;
  canonical: string;
  introduction?: string;
  list?: PackageListItemModel[] = [];

  public static findDocumentReference(implementationGuide: IImplementationGuide) {
    const found = <R4DocumentReference> implementationGuide.contained
      .find((c) => {
        if (c.resourceType === 'DocumentReference') {
          const dr = <R4DocumentReference> c;
          return dr.type && dr.type.coding && dr.type.coding.length > 0 && dr.type.coding[0].code === 'package-list';
        }

        return false;
      });

    return found;
  }

  public static getPackageList(implementationGuide: IImplementationGuide) {
    if (!implementationGuide || !implementationGuide.contained) {
      return;
    }

    const found = this.findDocumentReference(implementationGuide);

    if (found && found.content.length > 0 && found.content[0].attachment && found.content[0].attachment.data) {
      const decoded = typeof atob !== 'undefined' ? atob(found.content[0].attachment.data) : Buffer.from(found.content[0].attachment.data, 'base64').toString();

      try {
        const packageList = new PackageListModel();
        Object.assign(packageList, JSON.parse(decoded));
        return packageList;
      } catch (ex) {
      }
    }
  }

  public static setPackageList(implementationGuide: IImplementationGuide, packageList: PackageListModel, fhirVersion: Versions) {
    if (!implementationGuide) return;

    implementationGuide.contained = implementationGuide.contained || [];
    let found: STU3DocumentReference | R4DocumentReference = this.findDocumentReference(implementationGuide);

    if (!found) {
      if (fhirVersion === Versions.STU3) {
        found = new STU3DocumentReference();
      } else if (fhirVersion === Versions.R4) {
        found = new R4DocumentReference();
      }

      found.type = {
        coding: [{
          code: 'package-list'
        }]
      };
      found.content = [{
        attachment: {
          contentType: 'application/json'
        }
      }];
      implementationGuide.contained.push(found);
    }

    found.id = "package-list";
    found.status = 'current';

    if (fhirVersion === Versions.STU3) {
      (<STU3DocumentReference> found).indexed = (new Date()).toISOString();
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

    const json = JSON.stringify(packageList, null, '\t');
    found.content[0].attachment.data = typeof btoa !== 'undefined' ? btoa(json) : Buffer.from(json).toString('base64');

    implementationGuide.extension = implementationGuide.extension || [];
    let ext = implementationGuide.extension.find(e => e.url === Globals.extensionUrls['extension-ig-package-list'] && e.valueReference && e.valueReference.reference === '#package-list');

    if (!ext) {
      ext = {
        url: Globals.extensionUrls['extension-ig-package-list'],
        valueReference: {
          reference: '#package-list'
        }
      };
      implementationGuide.extension.push(ext);
    }
  }
}
