import { ParseConformance } from 'fhir/parseConformance';
import { Fhir, Versions as FhirVersions } from 'fhir/fhir';
import * as path from 'path';
import * as fs from 'fs-extra';
import JSZip from 'jszip';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Logger, UnauthorizedException } from '@nestjs/common';
import {
  AuditEvent as STU3AuditEvent,
  DomainResource as STU3DomainResource,
  ImplementationGuide as STU3ImplementationGuide,
  PackageResourceComponent
} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import { buildUrl, getR4Dependencies, getSTU3Dependencies } from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {
  AuditEvent as R4AuditEvent,
  DomainResource as R4DomainResource, ImplementationGuide,
  ImplementationGuide as R4ImplementationGuide
} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import { AxiosRequestConfig } from 'axios';
import { IUserSecurityInfo } from './base.controller';
import { addPermission, findPermission, getErrorString, parsePermissions } from '../../../../libs/tof-lib/src/lib/helper';
import { ConfigService } from './config.service';
import { Globals } from '../../../../libs/tof-lib/src/lib/globals';
import { IAuditEvent, IDomainResource, IImplementationGuide } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { TofLogger } from './tof-logger';
import { IConformance, IExample, IProjectResourceReference } from '@trifolia-fhir/models';
import { ConformanceService } from './conformance/conformance.service';
import { ObjectId } from 'mongodb';

declare var jasmine;

export class FhirInstances {
  private static fhirStu3Instance: Fhir;
  private static fhirR4Instance: Fhir;

  private static fhirR5Instance: Fhir;

  static get fhirStu3() {
    if (!this.fhirStu3Instance) {
      this.fhirStu3Instance = getFhirStu3Instance();
    }
    return this.fhirStu3Instance;
  }

  static get fhirR4() {
    if (!this.fhirR4Instance) {
      this.fhirR4Instance = getFhirR4Instance();
    }
    return this.fhirR4Instance;
  }

  static get fhirR5() {
    if (!this.fhirR5Instance) {
      this.fhirR5Instance = getFhirR5Instance();
    }
    return this.fhirR5Instance;
  }
}

export const zip = async (p: string) => {
  const getFilePathsRecursiveSync = (dir: string) => {
    let results = [];
    const list = fs.readdirSync(dir);
    let pending = list.length;
    if (!pending) return results;

    for (let file of list) {
      file = path.resolve(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        const res = getFilePathsRecursiveSync(file);
        results = results.concat(res);
      } else {
        results.push(file);
      }
      if (!--pending) return results;
    }

    return results;
  };

  const getZippedFolderSync = (dir: string) => {
    const allPaths = getFilePathsRecursiveSync(dir);
    const newZip = new JSZip();

    for (const filePath of allPaths) {
      const addPath = path.relative(dir, filePath);
      newZip.file(addPath, fs.readFileSync(filePath));
    }

    return newZip;
  };

  return new Promise((resolve) => {
    const zipped = getZippedFolderSync(p);
    zipped.generateAsync({ type: 'nodebuffer' }).then((content) => {
      resolve(content);
    });
  });
};

export const unzip = async (buffer: Buffer, destinationPath: string, bypassSubDir?: string) => {
  const zipFile = await JSZip.loadAsync(buffer);
  const fileNames = Object.keys(zipFile.files);
  const promises = fileNames.map(async fileName => {
    const file = zipFile.file(fileName);
    const bypassedFileName = bypassSubDir && fileName.startsWith(bypassSubDir + '/') ?
      fileName.substring(bypassSubDir.length + 1) :
      fileName;

    if (file) {
      const content = await file.async('nodebuffer');
      const destinationFileName = path.join(destinationPath, bypassedFileName);
      fs.ensureDirSync(path.dirname(destinationFileName));
      fs.writeFileSync(destinationFileName, content);
    }
  });
  await Promise.all(promises);
};

export const emptydir = (p): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.emptyDir(p, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const rmdir = (p): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.rmdir(p, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export async function createAuditEvent(logger: TofLogger, httpService: HttpService, fhirServerVersion: string,
  fhirServerBase: string, action: string, usi: IUserSecurityInfo, resource: IDomainResource) {
  try {
    let auditEvent: IAuditEvent;

    if (fhirServerVersion === 'stu3') {
      const stu3AuditEvent = new STU3AuditEvent();
      stu3AuditEvent.type = {
        code: '110100',
        display: 'Application Activity'
      };
      stu3AuditEvent.action = action;
      stu3AuditEvent.recorded = new Date(Date.now()).formatFhir();
      stu3AuditEvent.agent = [{
        userId: {
          value: usi.practitioner.identifier[0].value
        },
        requestor: true,
        reference: {
          reference: `Practitioner/${usi.practitioner.id}`
        }
      }];
      stu3AuditEvent.entity = [{
        type: {
          code: resource.resourceType
        },
        securityLabel: resource.meta && resource.meta.security ? resource.meta.security : null,
        reference: {
          reference: `${resource.resourceType}/${resource.id}`
        }
      }];
      auditEvent = stu3AuditEvent;
    } else if (fhirServerVersion === 'r4') {
      const r4AuditEvent = new R4AuditEvent();
      r4AuditEvent.type = {
        code: '110100',
        display: 'Application Activity'
      };
      r4AuditEvent.action = action;
      r4AuditEvent.recorded = new Date(Date.now()).formatFhir();
      r4AuditEvent.agent = [{
        altId: usi.practitioner.identifier[0].value,
        requestor: true,
        who: {
          reference: `Practitioner/${usi.practitioner.id}`
        }
      }];
      r4AuditEvent.entity = [{
        type: {
          code: resource.resourceType
        },
        securityLabel: resource.meta && resource.meta.security ? resource.meta.security : null,
        what: {
          reference: `${resource.resourceType}/${resource.id}`
        }
      }];
      auditEvent = r4AuditEvent;
    } else {
      throw new Error(`Cannot create AuditEvent for unexpected FHIR server version ${fhirServerVersion}`);
    }

    const url: string = buildUrl(fhirServerBase, 'AuditEvent');

    await httpService.post(url, auditEvent).toPromise();
  } catch (ex) {
    logger.error(`Failed to create audit event record due to: ${ex.message}`);
  }
}

export interface ParsedFhirUrl {
  resourceType?: string;
  id?: string;
  operation?: string;
  query?: { [key: string]: string | boolean };
  versionId?: string;
  isHistory: boolean;
}

export function parseFhirUrl(url: string) {
  const parsed: ParsedFhirUrl = {
    isHistory: false
  };

  if (!url || url === '/') {
    return parsed;
  }

  if (url.startsWith('/')) {
    url = url.substring(1);
  }

  let parts;

  if (url.indexOf('?') >= 0) {
    const query = url.substring(url.indexOf('?') + 1);
    const queryParts = query.split('&');

    parsed.query = {};

    queryParts.forEach((queryPart) => {
      if (queryPart.indexOf('=') >= 0) {
        parsed.query[queryPart.split('=')[0]] = queryPart.split('=')[1];
      } else {
        parsed.query[queryPart] = true;
      }
    });

    parts = url.substring(0, url.indexOf('?')).split('/');
  } else {
    parts = url.split('/');
  }

  if (parts && parts.length >= 2 && parts[parts.length - 1] === 'fhir' && parts[parts.length - 2] === 'api') {
    return parsed;
  }

  if (parts.length > 0) {
    parsed.resourceType = parts[0];
  }

  if (parts.length > 1) {
    if (parts[1].startsWith('$')) {
      parsed.operation = parts[1];
    } else if (parts[1] === '_search') {
      // do nothing
    } else {
      parsed.id = parts[1];
    }
  }

  if (parts.length > 2) {
    if (parts[2].startsWith('$')) {
      parsed.operation = parts[2];
    } else if (parts[2] === '_history' && parts.length > 3) {
      parsed.isHistory = true;
      parsed.versionId = parts[3];
    } else if (parts[2] === '_history') {
      parsed.isHistory = true;
    } else {
      throw new BadRequestException();
    }

    if (parts.length > 4) {
      if (parsed.versionId && parts[4].startsWith('$')) {
        parsed.operation = parts[4];
      } else {
        throw new BadRequestException();
      }
    }
  }

  if (parts.length > 5) {
    throw new BadRequestException();
  }

  return parsed;
}

function getJsonFromFile(actualPath: string) {
  const contentStream = fs.readFileSync(actualPath);
  const content = contentStream.toString('utf8');
  return JSON.parse(content);
}

export function getFhirStu3Instance(tool = false) {
  let rootDir = __dirname;

  try {
    if (tool) {
      rootDir = '../server';
    } else if (jasmine) {
      rootDir = path.join(__dirname, '../../../../libs/tof-lib/src');
    }
  } catch (ex) {
  }

  const parser = new ParseConformance(false, FhirVersions.STU3);
  const valueSets = getJsonFromFile(path.join(rootDir, 'assets/stu3/valuesets.json'));
  const types = getJsonFromFile(path.join(rootDir, 'assets/stu3/profiles-types.json'));
  const resources = getJsonFromFile(path.join(rootDir, 'assets/stu3/profiles-resources.json'));
  const iso3166 = getJsonFromFile(path.join(rootDir, 'assets/stu3/codesystem-iso3166.json'));

  parser.parseBundle(valueSets);
  parser.parseBundle(types);
  parser.parseBundle(resources);
  parser.loadCodeSystem(iso3166);

  return new Fhir(parser);
}

export function getFhirR4Instance(tool = false) {
  let rootDir = __dirname;

  try {
    if (tool) {
      rootDir = '../server';
    } else if (jasmine) {
      rootDir = path.join(__dirname, '../../../../libs/tof-lib/src');
    }
  } catch (ex) {
  }

  const parser = new ParseConformance(false, FhirVersions.R4);
  const valueSets = getJsonFromFile(path.join(rootDir, 'assets/r4/valuesets.json'));
  const types = getJsonFromFile(path.join(rootDir, 'assets/r4/profiles-types.json'));
  const resources = getJsonFromFile(path.join(rootDir, 'assets/r4/profiles-resources.json'));
  const iso3166 = getJsonFromFile(path.join(rootDir, 'assets/r4/codesystem-iso3166.json'));

  parser.parseBundle(valueSets);
  parser.parseBundle(types);
  parser.parseBundle(resources);
  parser.loadCodeSystem(iso3166);

  return new Fhir(parser);
}

export function getFhirR5Instance(tool = false) {
  let rootDir = __dirname;

  try {
    if (tool) {
      rootDir = '../server';
    } else if (jasmine) {
      rootDir = path.join(__dirname, '../../../../libs/tof-lib/src');
    }
  } catch (ex) {
  }

  const parser = new ParseConformance(false, FhirVersions.R4);
  const valueSets = getJsonFromFile(path.join(rootDir, 'assets/r5/valuesets.json'));
  const types = getJsonFromFile(path.join(rootDir, 'assets/r5/profiles-types.json'));
  const resources = getJsonFromFile(path.join(rootDir, 'assets/r5/profiles-resources.json'));
  const iso3166 = getJsonFromFile(path.join(rootDir, 'assets/r5/codesystem-iso3166.json'));

  parser.parseBundle(valueSets);
  parser.parseBundle(types);
  parser.parseBundle(resources);
  parser.loadCodeSystem(iso3166);

  return new Fhir(parser);
}

/**
 * Adds a structure definition to the specified implementation guide
 * @param httpService {HttpService} An http service that can be used to make requests against the fhir server
 * @param configService {ConfigService} The config service used to check permissions for a given resource
 * @param fhirServerBase {string}
 * @param fhirServerVersion {string}
 * @param resource The structure definition to add (must have an id)
 * @param userSecurityInfo {IUserSecurityInfo}
 * @param implementationGuide The id (or concrete resource) of the implementation guide to add the structure definition to
 * @param shouldPersistIg Indicates if the ig should be persisted/save during this operation, or if it will be taken care of elsewhere
 */

export async function addToImplementationGuide(httpService: HttpService, configService: ConfigService, fhirServerBase: string, fhirServerVersion: string, resource: STU3DomainResource | R4DomainResource, userSecurityInfo: IUserSecurityInfo, implementationGuide: string | STU3ImplementationGuide | R4ImplementationGuide, shouldPersistIg: boolean): Promise<void> {
  if (typeof implementationGuide === 'string' && shouldPersistIg) {
    throw new Error('Cannot persist the IG when it is passed as a string. It will not persisted elsewhere.');
  }

  // Don't add implementation guides to other implementation guides (or itself).
  if (resource.resourceType === 'ImplementationGuide') {
    return Promise.resolve();
  }

  const logger = new Logger('Helper.addToImplementationGuide');

  logger.verbose(`Adding resource ${resource.resourceType}/${resource.id} to context implementation guide.`);

  let igId;
  let igUrl;
  let changed = false;
  const resourceReferenceString = `${resource.resourceType}/${resource.id}`;

  if (typeof implementationGuide === 'string') {
    igId = <string>implementationGuide;
    igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', igId);

    logger.verbose(`Retrieving implementation guide ${igId}`);

    const igResults = await httpService.get<STU3ImplementationGuide | R4ImplementationGuide>(igUrl).toPromise();
    implementationGuide = igResults.data;
  } else {
    igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', implementationGuide.id);
  }

  logger.verbose(`Asserting that user can edit the implementation guide ${igId}`);

  assertUserCanEdit(configService, userSecurityInfo, implementationGuide);

  if (fhirServerVersion !== 'stu3') {        // r4+
    const r4 = <R4ImplementationGuide>implementationGuide;

    r4.definition = r4.definition || { resource: [] };
    r4.definition.resource = r4.definition.resource || [];

    let foundResource = r4.definition.resource.find((r) => {
      if (r.reference) {
        return r.reference.reference === resourceReferenceString;
      }
    });
    if (foundResource) {
      // remove existing
      const removeIndex = r4.definition.resource.findIndex(r => r.reference.reference === resourceReferenceString);
      r4.definition.resource.splice(removeIndex, 1);
      foundResource = undefined;
    }
    if (!foundResource) {
      const display = (<any>resource).title || (<any>resource).name;
      const description = (<any>resource).description;

      logger.verbose('Resource not already part of implementation guide, adding to IG\'s list of resources.');

      r4.definition.resource.push(Globals.profileTypes.concat(Globals.terminologyTypes).indexOf(resource.resourceType) < 0 && resource.meta.profile ?
        {
          reference: {
            reference: resourceReferenceString,
            display: display
          },
          exampleCanonical: resource.meta.profile[0],
          name: display
        } :
        {
          reference: {
            reference: resourceReferenceString,
            display: display
          },
          exampleBoolean: Globals.profileTypes.concat(Globals.terminologyTypes).indexOf(resource.resourceType) < 0,
          name: display,
          description: description
        });
      changed = true;
    }
  } else {                                        // stu3
    const stu3 = <STU3ImplementationGuide>implementationGuide;

    stu3.package = stu3.package || [];

    const foundInPackages = (stu3.package || []).filter((igPackage) => {
      const foundResources = (igPackage.resource || []).filter((r) => {
        if (r.sourceReference && r.sourceReference.reference) {
          return r.sourceReference.reference === resourceReferenceString;
        }
      });

      return foundResources.length > 0;
    });

    if (foundInPackages.length > 0) {
      // remove existing
      (stu3.package || []).filter((igPackage) => {
        const removeIndex = (igPackage.resource || []).findIndex((r) => {
          if (r.sourceReference && r.sourceReference.reference) {
            return r.sourceReference.reference === resourceReferenceString;
          }
        });
        igPackage.resource.splice(removeIndex, 1);
      });
    }

    if (foundInPackages.length === 0) {
      const display = (<any>resource).title || (<any>resource).name;
      const description = (<any>resource).description;

      const newResource: PackageResourceComponent = {
        name: display,
        description: description,
        sourceReference: {
          reference: resourceReferenceString,
          display: display
        },
        example: Globals.profileTypes.concat(Globals.terminologyTypes).indexOf(resource.resourceType) < 0
      };

      if (stu3.package.length === 0) {
        logger.verbose('STU3 IG does not contain a package, adding a default package with the resource added to it.');

        stu3.package.push({
          name: 'Default Package',
          resource: [newResource]
        });
        changed = true;
      } else {
        if (!stu3.package[0].resource) {
          stu3.package[0].resource = [];
        }

        logger.verbose(`Adding resource to implementation guide's ${stu3.package[0].name} package.`);

        stu3.package[0].resource.push(newResource);
        changed = true;
      }
    }
  }

  // Only update the resource on the server if the implementation guide passed to us
  // was just a string. Otherwise, the caller is managing the concrete implementation
  // outside of this method and they should be responsible for persisting the changes
  if (shouldPersistIg) {
    const updateOptions: AxiosRequestConfig = {
      method: 'PUT',
      url: igUrl,
      data: implementationGuide
    };

    if (changed) {
      logger.verbose(`Persisting the implementation guide ${igId} with the resource added.`);

      try {
        await httpService.request(updateOptions).toPromise();
      } catch (ex) {
        logger.error(`An error occurred when adding the resource to the implementation guide in context: ${getErrorString(ex)}`);
      }
    }
  }

  return Promise.resolve();
}

export async function addToImplementationGuideNew(service: ConformanceService, resourceToAdd: IConformance | IExample, implementationGuideId: string, isExample: boolean = false): Promise<void> {

  // Don't add implementation guides to other implementation guides (or itself).
  if (!isExample && (<IConformance>resourceToAdd).resource.resourceType == 'ImplementationGuide') {
    return Promise.resolve();
  }

  const logger = new Logger('Helper.addToImplementationGuide');

  // get the implementationguide
  let implGuideResource = await service.findById(implementationGuideId);
  let implementationGuide = <IImplementationGuide>implGuideResource.resource;

  let changed = false;
  let resourceReferenceString;
  let isNotFhir: boolean = false;

  // if new resource is not an example it can only be treated as a valid fhir resource
  if (!isExample) {
    if ('resource' in resourceToAdd && resourceToAdd.resource) {
      resourceReferenceString = `${(<IConformance>resourceToAdd).resource.resourceType}/${(<IConformance>resourceToAdd).resource.id || resourceToAdd.id}`
    } else {
      throw new BadRequestException("Supplied conformance object does not have a valid resource property.");
    }
  } else {

    // try a few different ways to add an example
    try {

      let resourceType: string;
      let resourceId: string;

      // received an object with a resource property set so we'll use that and treat it as a valid fhir resource
      if ('resource' in resourceToAdd && !!resourceToAdd.resource) {
        resourceType = resourceToAdd.resource.resourceType;
        resourceId = resourceToAdd.resource.id || resourceToAdd.id;
      }

      // example content is probably a valid fhir resource so try that first
      else if ('content' in resourceToAdd && !!resourceToAdd.content) {
          // try parsing the string to a valid JSON object
          let content: any;
          if (typeof resourceToAdd.content !== typeof '') {
            resourceToAdd.content = JSON.stringify(resourceToAdd.content);
          }
          try {
            content = JSON.parse(resourceToAdd.content);
            resourceType = content['resourceType'];
            resourceId = content['id'] || resourceToAdd.id;
          }

          // JSON parsing failed... if this is a CDA IG we'll add it as a special case
          catch (error) {
            if (implementationGuideIsCDA(implGuideResource)) {
              resourceType = 'Binary';
              resourceId = resourceToAdd.name?resourceToAdd.name:resourceToAdd.id;
              isNotFhir = true;
            } else {
              throw error;
            }
          }

      }

      // don't know how to process the supplied resource
      else {
        throw new BadRequestException();
      }

      if (!resourceType || !resourceId) {
        throw new BadRequestException();
      }

      resourceReferenceString = `${resourceType}/${resourceId}`;

    }
    // no valid resource supplied
    catch (e) {
      throw new BadRequestException("Supplied example does not have a valid content property.");
    }

  }


  let exampleFor: string;
  if (resourceToAdd['resource']) {
    let profile = (<IConformance>resourceToAdd).resource?.meta?.profile;
    if (profile) {
      exampleFor = profile[0];
    }
  }


  logger.verbose(`Adding resource ${resourceReferenceString} to context implementation guide.  Example? (${isExample})  ExampleFor: "${exampleFor}"`);


  if (resourceToAdd.fhirVersion !== 'stu3') {        // r4+
    const r4 = <R4ImplementationGuide>implementationGuide;

    r4.definition = r4.definition || { resource: [] };
    r4.definition.resource = r4.definition.resource || [];

    let foundResource = r4.definition.resource.find((r) => {
      if (r.reference) {
        return r.reference.reference === resourceReferenceString;
      }
    });
    if (foundResource) {
      // remove existing
      const removeIndex = r4.definition.resource.findIndex(r => r.reference.reference === resourceReferenceString);
      r4.definition.resource.splice(removeIndex, 1);
      foundResource = undefined;
    }
    if (!foundResource) {

      logger.verbose('Resource not already part of implementation guide, adding to IG\'s list of resources.');

      // special case for adding non-fhir examples
      if (isNotFhir) {
        const display = (<any>resourceToAdd).name || (<any>resourceToAdd).id;
        r4.definition.resource.push({
          extension: [{
            url: 'http://hl7.org/fhir/StructureDefinition/implementationguide-resource-format',
            valueString: 'application/xml'
          }],
          reference: {
            reference: resourceReferenceString,
            display: display
          },
          exampleCanonical: exampleFor,
          name: display
        });

      } else {
        // otherwise do the usual...
        let name;
        if(typeof (<any>resourceToAdd).resource.name == typeof ''){
          name = (<any>resourceToAdd).resource.name;
        }
        const display = name || (<any>resourceToAdd).resource.title;
        const description = (<any>resourceToAdd).resource.description;
        r4.definition.resource.push(isExample && exampleFor ?
          {
            reference: {
              reference: resourceReferenceString,
              display: display
            },
            exampleCanonical: exampleFor,
            name: display
          } :
          {
            reference: {
              reference: resourceReferenceString,
              display: display
            },
            exampleBoolean: isExample == "true" ? true: false,
            name: display,
            description: description
          });
      }
      changed = true;
    }
  } else {                                        // stu3
    const stu3 = <STU3ImplementationGuide>implementationGuide;

    stu3.package = stu3.package || [];

    const foundInPackages = (stu3.package || []).filter((igPackage) => {
      const foundResources = (igPackage.resource || []).filter((r) => {
        if (r.sourceReference && r.sourceReference.reference) {
          return r.sourceReference.reference === resourceReferenceString;
        }
      });

      return foundResources.length > 0;
    });

    if (foundInPackages.length > 0) {
      // remove existing
      (stu3.package || []).filter((igPackage) => {
        const removeIndex = (igPackage.resource || []).findIndex((r) => {
          if (r.sourceReference && r.sourceReference.reference) {
            return r.sourceReference.reference === resourceReferenceString;
          }
        });
        igPackage.resource.splice(removeIndex, 1);
      });
    }

    if (foundInPackages.length === 0) {
      let display;
      let description;

      if (isNotFhir) {
         display = (<any>resourceToAdd).name || (<any>resourceToAdd).id;
      }
      else {
        let name;
        if(typeof (<any>resourceToAdd).resource.name == typeof ''){
          name = (<any>resourceToAdd).resource.name;
        }
        display =  name || (<any>resourceToAdd).resource.title ;
        description = (<any>resourceToAdd).resource.description;
      }

      const newResource : PackageResourceComponent = {
        name: display,
        description: description,
        sourceReference: {
          reference: resourceReferenceString,
          display: display
        },
        example: isExample == "true" ? true: false
      }

      if (stu3.package.length === 0) {
        logger.verbose('STU3 IG does not contain a package, adding a default package with the resource added to it.');

        stu3.package.push({
          name: 'Default Package',
          resource: [newResource]
        });
        changed = true;
      } else {
        if (!stu3.package[0].resource) {
          stu3.package[0].resource = [];
        }

        logger.verbose(`Adding resource to implementation guide's ${stu3.package[0].name} package.`);

        stu3.package[0].resource.push(newResource);
        changed = true;
      }
    }
  }

  // update the Ig
  if (changed) {
    implGuideResource.references = implGuideResource.references || [];
    // add to references if not already in the reference list
    if (!implGuideResource.references.find((r: IProjectResourceReference) => {
      if (r.valueType !== (isNotFhir ? 'Example' : 'Conformance')) return false;
      if (r.value && r.value.toString() === resourceToAdd.id) return true;
    })) {
      implGuideResource.references.push({ value: resourceToAdd, valueType: isNotFhir ? 'Example' : 'Conformance' });
    }
    let conf = await service.updateOne(implGuideResource.id, implGuideResource);
    //console.log('Conformance ' + conf);
  }
  return Promise.resolve();
}

export async function removeFromImplementationGuideNew(service: ConformanceService, resourceToRemove: IConformance): Promise<void> {

  let ref = `${resourceToRemove.resource.resourceType}/${resourceToRemove.resource.id ?? resourceToRemove.id}`;

  // remove from all version 4 Ig-s that reference it  -- later based on permissions
  let confRes = <IConformance[]>await service.findAll({ 'resource.definition.resource.reference.reference': ref });

  async function updateReference(conf: IConformance) {
    let conformance = await service.getModel().findById(conf.id).populate('references.value');
    (conformance.references || []).forEach((r: IProjectResourceReference, index) => {
      if (!r.value || typeof r.value === typeof '') return;
      if (r.valueType === 'Conformance' || r.valueType === 'Example') {
        const val: IConformance = <IConformance>r.value;
        if (val.id === resourceToRemove.id) {
          conf.references.splice(index, 1);
        }
      }
    });
  }

  for (const conf of (confRes || [])) {
    if (conf.resource.resourceType == 'ImplementationGuide') {
      let ig = <R4ImplementationGuide>conf.resource;
      ig.definition.resource.filter(res => res.reference && res.reference.reference === ref).forEach(res => ig.definition.resource.splice(ig.definition.resource.indexOf(res), 1));
      // remove reference
      await updateReference(conf);

      await service.updateOne(conf.id, conf);
    }
  }

  // remove from all version 3 Ig-s that reference it  - later based on permissions
  confRes = <IConformance[]>await service.findAll({ 'resource.package.resource.sourceReference.reference': ref });
  for (const conf of (confRes || [])) {
    if (conf.resource.resourceType == 'ImplementationGuide') {
      let ig = <STU3ImplementationGuide>conf.resource;
      ig.package.forEach(pack => pack.resource.filter(res => res.sourceReference && res.sourceReference.reference === ref).forEach(res => pack.resource.splice(pack.resource.indexOf(res), 1)));
      // remove reference
      await updateReference(conf);

      await service.updateOne(conf.id, conf);
    }
  }
}

export function implementationGuideIsCDA(implementationGuide: IConformance): boolean {
  let deps = implementationGuide.fhirVersion === 'stu3' ?
    getSTU3Dependencies(<STU3ImplementationGuide>implementationGuide.resource) :
    getR4Dependencies(<R4ImplementationGuide>implementationGuide.resource);

  return (deps || []).findIndex((d: string) => {
    return [
      'hl7.fhir.cda'
    ].includes((d || '').split('#')[0])
  }) > -1;
}


/**
 * Asserts that the user has the permissions necessary on the resource to edit the resource.
 * @param configService
 * @param userSecurityInfo
 * @param resource
 */
export function assertUserCanEdit(configService: ConfigService, userSecurityInfo: IUserSecurityInfo, resource: any) {
  if (configService.fhir && configService.fhir.nonEditableResources) {
    switch (resource.resourceType) {
      case 'CodeSystem':
        if (!configService.fhir.nonEditableResources.codeSystems) {
          return;
        }

        if (configService.fhir.nonEditableResources.codeSystems.indexOf(resource.url) >= 0) {
          throw new BadRequestException(`CodeSystem with URL ${resource.url} cannot be modified.`);
        }
        break;
    }
  }

  // security is not enabled
  if (!userSecurityInfo) {
    return;
  }

  // User is an admin
  if (userSecurityInfo && userSecurityInfo.user && userSecurityInfo.user.isAdmin) {
    return;
  }

  if (findPermission(resource.meta, 'everyone', 'write')) {
    return;
  }

  if (userSecurityInfo.practitioner) {
    if (findPermission(resource.meta, 'user', 'write', userSecurityInfo.practitioner.id)) {
      return;
    }
  }

  if (userSecurityInfo.groups) {
    const foundGroups = userSecurityInfo.groups.filter((group) => {
      return findPermission(resource.meta, 'group', 'write', group.id);
    });

    if (foundGroups.length > 0) {
      return;
    }
  }

  throw new UnauthorizedException();
}

/**
 * Copies permissions from the source resource to the destination resource
 * @param source
 * @param destination
 */
export function copyPermissions(source: STU3DomainResource | R4DomainResource, destination: STU3DomainResource | R4DomainResource) {
  if (!destination || !source || !source.meta || !source.meta.security) {
    return;
  }

  const sourcePermissions = parsePermissions(source.meta);
  destination.meta = destination.meta || {};

  sourcePermissions.forEach((permission) => {
    //addPermission(destination.meta, permission.type, permission.permission, permission.id);
  });
}
