import {ImplementationGuide as R4ImplementationGuide, OperationOutcome, ResourceReference} from '@trifolia-fhir/r4';
import {Extension, ImplementationGuide as STU3ImplementationGuide} from '@trifolia-fhir/stu3';
import {ImplementationGuide as R5ImplementationGuide} from '@trifolia-fhir/r5';
import {customAlphabet} from 'nanoid';
import {Versions} from 'fhir/fhir';
import {ICodeableConcept, IDocumentReference, IImplementationGuide, IResourceReference} from './fhirInterfaces';
import {Globals} from './globals';
import {CustomMenu, INonFhirResource, IProjectResourceReference, IgnoreWarnings, NonFhirResource, Page} from '@trifolia-fhir/models';

export function findReferences(obj: any, resourceType?: string, id?: string) {
  const references = [];

  const next = (obj: any) => {
    if (!obj) return;

    if (obj.hasOwnProperty('reference') && typeof obj['reference'] === 'string' && obj['reference'].split('/').length === 2) {
      if (resourceType && id && obj.reference === `${resourceType}/${id}`) {
        references.push(obj);
      } else if (resourceType && !id && obj.reference.startsWith(resourceType + '/')) {
        references.push(obj);
      } else if (!resourceType && !id) {
        references.push(obj);
      }
    }

    const propertyNames = Object.keys(obj);

    for (let i = 0; i < propertyNames.length; i++) {
      const propertyName = propertyNames[i];

      if (typeof obj[propertyName] === 'object') {
        next(obj[propertyName]);
      }
    }
    return;
  };

  next(obj);

  return references;
}

export function identifyRelease(fhirVersion: string): Versions {
  if (!fhirVersion) {
    return Versions.R4;
  } else if (fhirVersion == Versions.R4.toLowerCase()) {
    return Versions.R4;
  } else if (fhirVersion == Versions.STU3.toLowerCase()) {
    return Versions.STU3;
  } else if (fhirVersion == Versions.R5.toLowerCase()) {
    return Versions.R5;
  } else {
    throw new Error('Unexpected FHIR Version ' + fhirVersion);
  }
}

export function joinUrl(...parts: string[]) {
  let url = '';

  for (let i = 0; i < parts.length; i++) {
    const argument = parts[i].toString();

    if (url && !url.endsWith('/')) {
      url += '/';
    }

    url += argument.startsWith('/') ? argument.substring(1) : argument;
  }

  return url;
}

/**
 * Builds a URL for the FHIR API from arguments
 * @param base The base of the URL (ex: https://some-fhir-server.com/fhir)
 * @param resourceType The resource type to query for
 * @param id The id of the resource
 * @param operation An operation to perform on the server (no resource type), the resource type, or the resource instance (with id)
 * @param params The query parameters to add onto the URL
 * @param separateArrayParams Indicates whether array-based query parameters should be combined using a comma (,) or if the query param should be repeated for each element of the array
 */
export function buildUrl(base: string, resourceType?: string, id?: string, operation?: string, params?: {[key: string]: any}, separateArrayParams = false) {
  let path = base;

  if (!path) {
    return;
  }

  if (resourceType) {
    path = joinUrl(path, resourceType);

    if (id) {
      path = joinUrl(path, id);
    }
  }

  if (operation) {
    if (!operation.startsWith('$')) operation = '$' + operation;
    path = joinUrl(path, operation);
  }

  if (params) {
    const keys = Object.keys(params);
    const paramArray = [];

    keys.forEach((key) => {
      if (params[key] instanceof Array) {
        const valueArray = <any[]> params[key];

        if (!separateArrayParams) {
          paramArray.push(`${key}=${encodeURIComponent(valueArray.join(','))}`);
        } else {
          valueArray.forEach((element) => paramArray.push(`${key}=${encodeURIComponent(element)}`));
        }
      } else {
        const value = params[key];

        if (value) {
          paramArray.push(`${key}=${encodeURIComponent(value)}`);
        }
      }
    });

    if (paramArray.length > 0) {
      path += '?' + paramArray.join('&');
    }
  }

  return path;
}

export function parseUrl(url: string, base?: string) {
  const parseUrlRegex = /([A-z]+)(\/([A-Za-z0-9\-\\.]+))?(\/_history\/([A-Za-z0-9\-]{1,64}))?/g;

  if (base && base.lastIndexOf('/') === base.length-1) {
    base = base.substring(0, base.length - 1);
  }

  const next = url.replace(base, '');
  const match = parseUrlRegex.exec(next);

  if (match) {
    return {
      resourceType: match[1],
      id: match[3],
      historyId: match[5]
    };
  }
}

export function createOperationOutcome(severity: string, code: string, diagnostics: string) {
  return <OperationOutcome> {
    resourceType: 'OperationOutcome',
    issue: [{
      severity: severity,
      code: code,
      diagnostics: diagnostics
    }]
  };
}

export function getExtensionString(obj: any, url: string): string {
  if (!obj) {
    return;
  }

  const foundExtension = (obj.extension || []).find((ex) => ex.url === url);

  if (foundExtension) {
    return foundExtension.valueString;
  }
}

export function setExtensionString(obj: any, url: string, value: string) {
  let foundExtension = (obj.extension || []).find((ex) => ex.url === url);

  if (value) {
    if (!foundExtension) {
      if (!obj.extension) {
        obj.extension = [];
      }

      foundExtension = { url: url };
      obj.extension.push(foundExtension);
    }

    foundExtension.valueString = value;
  } else if (!value && foundExtension) {
    const index = obj.extension.indexOf(foundExtension);
    obj.extension.splice(index, 1);
  }
}


export function getDefaultImplementationGuideResourcePath(reference: IResourceReference) {
  if (reference && reference.reference) {
    const parsed = parseUrl(reference.reference);

    if (parsed) {
      return `${parsed.resourceType.toLowerCase()}/${parsed.id}.xml`;
    }
  }
}

export function generateId(): string {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUBWXYZ', 8);
  return nanoid();
}

export class MediaReference {
  id: string;
  name: string;     // this becomes ImageItem.title
  description: string;
}

export function getImplementationGuideMediaReferences(fhirVersion: 'stu3'|'r4'|'r5', implementationGuide: STU3ImplementationGuide | R4ImplementationGuide | R5ImplementationGuide) {
  if (!implementationGuide) {
    return [];
  }

  switch (fhirVersion) {
    case 'stu3':
      const stu3ImplementationGuide = <STU3ImplementationGuide> implementationGuide;
      const mediaReferences: MediaReference[] = [];

      (stu3ImplementationGuide.package || []).forEach((pkg) => {
        (pkg.resource || [])
          .filter((resource) => resource.sourceReference && resource.sourceReference.reference && resource.sourceReference.reference.startsWith('Media/'))
          .forEach((resource) => {
            const mediaRef = new MediaReference();
            mediaRef.id = resource.sourceReference.reference.substring('Media/'.length);
            mediaRef.name = resource.name;
            mediaRef.description = resource.description;
            mediaReferences.push(mediaRef);
          });
      });

      return mediaReferences;
    default:
      const r4ImplementationGuide = <R4ImplementationGuide> implementationGuide;

      if (!r4ImplementationGuide.definition) {
        return [];
      }

      return (r4ImplementationGuide.definition.resource || [])
        .filter((resource) => {
          return resource.reference && resource.reference.reference && resource.reference.reference.startsWith('Media/');
        })
        .map((resource) => {
          const mediaRef = new MediaReference();
          mediaRef.id = resource.reference.reference.substring('Media/'.length);
          mediaRef.name = resource.name;
          mediaRef.description = resource.description;
          return mediaRef;
        });
  }
}

/**
 * Determines if the CodeableConcept has the specified code. If system is specified, both code and system must be found together.
 * @param codeableConcept
 * @param code
 * @param system
 */
export function codeableConceptHasCode(codeableConcept: ICodeableConcept, code: string, system?: string) {
  if (!codeableConcept || !codeableConcept.coding || codeableConcept.coding.length < 1) return false;
  return !!codeableConcept.coding.find(c => {
    if (system) {
      return c.code === code && c.system === system;
    } else {
      return c.code === code;
    }
  });
}

export function setIgnoreWarningsValue(implementationGuide: IImplementationGuide, value: string) {
  const Global = Globals;
  if (!implementationGuide) return;

  implementationGuide.extension = implementationGuide.extension || [];
  let foundExtension = implementationGuide.extension.find(e => e.url === Global.extensionUrls['extension-ig-ignore-warnings']);
  let foundContained = foundExtension && foundExtension.valueReference && foundExtension.valueReference.reference ?
    implementationGuide.contained.find(c => c.id === foundExtension.valueReference.reference.substring(1)) :
    null;

  if (!value) {
    if (foundExtension) {
      const foundExtensionIndex = implementationGuide.extension.indexOf(foundExtension);
      implementationGuide.extension.splice(foundExtensionIndex, foundExtensionIndex >= 0 ? 1 : 0);

      if (!implementationGuide.extension.length) delete implementationGuide.extension;
    }

    if (foundContained) {
      const foundContainedIndex = implementationGuide.contained.indexOf(foundContained);
      implementationGuide.contained.splice(foundContainedIndex, foundContainedIndex >= 0 ? 1 : 0);

      if (!implementationGuide.contained.length) delete implementationGuide.contained;
    }
  } else {
    if (!foundExtension) {
      foundExtension = {
        url: Global.extensionUrls['extension-ig-ignore-warnings'],
        valueReference: {
          reference: `#${generateId()}`
        }
      };
      implementationGuide.extension.push(foundExtension);
    }

    implementationGuide.contained = implementationGuide.contained || [];

    if (!foundContained) {
      foundContained = <IDocumentReference> {
        resourceType: 'DocumentReference',
        id: foundExtension.valueReference.reference.substring(1),
        status: 'current',
        type: {
          coding: [{
            code: 'ignore-warnings'
          }]
        },
        content: [{
          attachment: {
            contentType: 'text/plain',
            title: 'ignoreWarnings.txt',
            data: btoa(encodeURIComponent(value))
          }
        }]
      };
      implementationGuide.contained.push(foundContained);
    } else {
      const docRef = <IDocumentReference> foundContained;
      docRef.content[0].attachment.data = btoa(encodeURIComponent(value));
    }
  }
}

export function getIgnoreWarningsValue(fhirResource: any): string {
  // const Global = Globals;
  // if (!implementationGuide || !implementationGuide.extension || !implementationGuide.contained) return;

  // // Find the extension that references the contained DocumentReference
  // const foundExtension = implementationGuide.extension.find(e => e.url === Global.extensionUrls['extension-ig-ignore-warnings']);
  // if (!foundExtension) return;
  // const ignoreWarningsReference = foundExtension.valueReference ? foundExtension.valueReference.reference : '';
  // if (!ignoreWarningsReference.startsWith('#')) return;

  // // Find the contained DocumentReference based on the extension reference
  // const foundContained = implementationGuide.contained.find(c => {
  //   if (c.resourceType !== 'DocumentReference' || c.id !== ignoreWarningsReference.substring(1)) return false;
  //   const docRef = <IDocumentReference>c;
  //   return codeableConceptHasCode(docRef.type, 'ignore-warnings') &&
  //     docRef.content &&
  //     docRef.content.length === 1 &&
  //     docRef.content[0].attachment &&
  //     docRef.content[0].attachment.data;
  // });

  // if (foundContained) {
  //   const documentReference = <IDocumentReference>foundContained;

  //   // Set the data after decoding it from base64
  //   if (typeof atob === 'function') {
  //     return decodeURIComponent(atob(documentReference.content[0].attachment.data));
  //   } else {
  //     // @ts-ignore
  //     return decodeURIComponent(new Buffer(documentReference.content[0].attachment.data, 'base64').toString());
  //   }
  // }
  let content = "";
  const ignoreWarningsIndex = (fhirResource.references || []).findIndex((r: IProjectResourceReference) => r.valueType == NonFhirResource.name && !!r.value && typeof r.value == typeof {} && (<INonFhirResource>r.value).type === IgnoreWarnings.name)
  if (ignoreWarningsIndex > -1) {
    let iw = fhirResource.references[ignoreWarningsIndex].value as IgnoreWarnings;
    content = iw.content;
  }
  return content;
}

export function setCustomMenu(implementationGuide: IImplementationGuide, value: string) {
  const Global = Globals;
  if (!implementationGuide) return;

  implementationGuide.extension = implementationGuide.extension || [];
  let foundExtension = implementationGuide.extension.find(e => e.url === Global.extensionUrls['extension-ig-custom-menu']);
  let foundContained = foundExtension && foundExtension.valueReference && foundExtension.valueReference.reference ?
    implementationGuide.contained.find(c => c.id === foundExtension.valueReference.reference.substring(1)) :
    null;

  if (!value) {
    if (foundExtension) {
      const foundExtensionIndex = implementationGuide.extension.indexOf(foundExtension);
      implementationGuide.extension.splice(foundExtensionIndex, foundExtensionIndex >= 0 ? 1 : 0);

      if (!implementationGuide.extension.length) delete implementationGuide.extension;
    }

    if (foundContained) {
      const foundContainedIndex = implementationGuide.contained.indexOf(foundContained);
      implementationGuide.contained.splice(foundContainedIndex, foundContainedIndex >= 0 ? 1 : 0);

      if (!implementationGuide.contained.length) delete implementationGuide.contained;
    }
  } else {
    if (!foundExtension) {
      foundExtension = {
        url: Global.extensionUrls['extension-ig-custom-menu'],
        valueReference: {
          reference: `#${generateId()}`
        }
      };
      implementationGuide.extension.push(foundExtension);
    }

    implementationGuide.contained = implementationGuide.contained || [];

    if (!foundContained) {
      foundContained = <IDocumentReference> {
        resourceType: 'DocumentReference',
        id: foundExtension.valueReference.reference.substring(1),
        status: 'current',
        type: {
          coding: [{
            code: 'custom-menu'
          }]
        },
        content: [{
          attachment: {
            contentType: 'application/xml',
            title: 'menu.xml',
            data: btoa(value)
          }
        }]
      };
      implementationGuide.contained.push(foundContained);
    } else {
      const docRef = <IDocumentReference> foundContained;
      docRef.content[0].attachment.data = btoa(value);
    }
  }
}

export function getCustomMenu(fhirResource: any): string {
 /* const Global = Globals;
  if (!implementationGuide || !implementationGuide.extension || !implementationGuide.contained) return;

  // Find the extension that references the contained DocumentReference
  const foundExtension = implementationGuide.extension.find(e => e.url === Global.extensionUrls['extension-ig-custom-menu']);
  if (!foundExtension) return;
  const customMenuReference = foundExtension.valueReference ? foundExtension.valueReference.reference : '';
  if (!customMenuReference.startsWith('#')) return;

  // Find the contained DocumentReference based on the extension reference
  const foundContained = implementationGuide.contained.find(c => {
    if (c.resourceType !== 'DocumentReference' || c.id !== customMenuReference.substring(1)) return false;
    const docRef = <IDocumentReference>c;
    return codeableConceptHasCode(docRef.type, 'custom-menu') &&
      docRef.content &&
      docRef.content.length === 1 &&
      docRef.content[0].attachment &&
      docRef.content[0].attachment.data;
  });

  if (foundContained) {
    const documentReference = <IDocumentReference>foundContained;

    // Set the data after decoding it from base64
    if (typeof atob === 'function') {
      return atob(documentReference.content[0].attachment.data);
    } else {
      // @ts-ignore
      return new Buffer(documentReference.content[0].attachment.data, 'base64').toString();
    }
  }*/
  let content = "";
  const customMenuIndex = (fhirResource.references || []).findIndex((r: IProjectResourceReference) => r.valueType == NonFhirResource.name && !!r.value && typeof r.value == typeof {} && (<INonFhirResource>r.value).type === CustomMenu.name)
  if (customMenuIndex > -1) {
    let cm = fhirResource.references[customMenuIndex].value as CustomMenu;
    content = cm.content;
  }
  return content;

}

export function getPages(fhirResource: any): Page[] {

  let  pages: Page[] = [];

  (fhirResource.references || []).forEach((r: IProjectResourceReference) => {
    if( r.valueType == NonFhirResource.name && !!r.value && typeof r.value == typeof {}  && (<INonFhirResource>r.value).type === Page.name) {
      let page = r.value as Page;
      pages.push(page);
    }
  });
  return pages;
}

export function setJiraSpecValue(implementationGuide: IImplementationGuide, value: string) {
  const Global = Globals;
  if (!implementationGuide) return;

  implementationGuide.extension = implementationGuide.extension || [];
  let foundExtension = implementationGuide.extension.find(e => e.url === Global.extensionUrls['extension-ig-jira-spec']);
  let foundContained = foundExtension && foundExtension.valueReference && foundExtension.valueReference.reference ?
    (implementationGuide.contained || []).find(c => c.id === foundExtension.valueReference.reference.substring(1)) :
    null;

  if (!value) {
    if (foundExtension) {
      const foundExtensionIndex = implementationGuide.extension.indexOf(foundExtension);
      implementationGuide.extension.splice(foundExtensionIndex, foundExtensionIndex >= 0 ? 1 : 0);

      if (!implementationGuide.extension.length) delete implementationGuide.extension;
    }

    if (foundContained) {
      const foundContainedIndex = implementationGuide.contained.indexOf(foundContained);
      implementationGuide.contained.splice(foundContainedIndex, foundContainedIndex >= 0 ? 1 : 0);

      if (!implementationGuide.contained.length) delete implementationGuide.contained;
    }
  } else {
    if (!foundExtension) {
      foundExtension = {
        url: Global.extensionUrls['extension-ig-jira-spec'],
        valueReference: {
          reference: `#${generateId()}`
        }
      };
      implementationGuide.extension.push(foundExtension);
    }

    implementationGuide.contained = implementationGuide.contained || [];

    if (!foundContained) {
      foundContained = <IDocumentReference> {
        resourceType: 'DocumentReference',
        id: foundExtension.valueReference.reference.substring(1),
        status: 'current',
        type: {
          coding: [{
            code: 'jira-spec'
          }]
        },
        content: [{
          attachment: {
            contentType: 'text/plain',
            title: 'jira-spec.xml',
            data: btoa(value)
          }
        }]
      };
      implementationGuide.contained.push(foundContained);
    } else {
      const docRef = <IDocumentReference> foundContained;
      docRef.content[0].attachment.data = btoa(value);
    }
  }
}

export function getJiraSpecValue(implementationGuide: IImplementationGuide): string {
  const Global = Globals;
  if (!implementationGuide || !implementationGuide.extension || !implementationGuide.contained) return;

  // Find the extension that references the contained DocumentReference
  const foundExtension = implementationGuide.extension.find(e => e.url === Global.extensionUrls['extension-ig-jira-spec']);
  if (!foundExtension) return;
  const jiraSpecReference = foundExtension.valueReference ? foundExtension.valueReference.reference : '';
  if (!jiraSpecReference.startsWith('#')) return;

  // Find the contained DocumentReference based on the extension reference
  const foundContained = implementationGuide.contained.find(c => {
    if (c.resourceType !== 'DocumentReference' || c.id !== jiraSpecReference.substring(1)) return false;
    const docRef = <IDocumentReference> c;
    return codeableConceptHasCode(docRef.type, 'jira-spec') &&
      docRef.content &&
      docRef.content.length === 1 &&
      docRef.content[0].attachment &&
      docRef.content[0].attachment.data;
  });

  if (foundContained) {
    const documentReference = <IDocumentReference> foundContained;

    // Set the data after decoding it from base64
    if (typeof atob === 'function') {
      return atob(documentReference.content[0].attachment.data);
    } else {
      // @ts-ignore
      return new Buffer(documentReference.content[0].attachment.data, 'base64').toString();
    }
  }
}

export function getSTU3Dependencies(ig: STU3ImplementationGuide): string[] {
  const Global = Globals;

  if (!ig || !ig.extension) return [];
  return ig.extension
    .filter(e => {
      return e.url === Global.extensionUrls['extension-ig-dependency'] &&
        e.extension &&
        e.extension.find(next => next.url === Global.extensionUrls['extension-ig-dependency-name'] && next.valueString) && // has ig-dependency-name
        e.extension.find(next => next.url === Global.extensionUrls['extension-ig-dependency-version'] && next.valueString); // has ig-dependency-version
    })
    .map(e => {
      const nameExtension = (e.extension || []).find((extension: Extension) => extension.url === Global.extensionUrls['extension-ig-dependency-name']);
      const versionExtension = (e.extension || []).find((extension: Extension) => extension.url === Global.extensionUrls['extension-ig-dependency-version']);
      return nameExtension.valueString +
        '#' +
        (versionExtension.valueString || 'current');
    });
}

export function getR4Dependencies(ig: R4ImplementationGuide): string[] {
  if (!ig || !ig.dependsOn) return [];
  return ig.dependsOn.map(dependency => {
    return dependency.packageId +
      '#' +
      (dependency.version || 'current');
  });
}
