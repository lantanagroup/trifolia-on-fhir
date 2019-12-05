import {ParseConformance} from 'fhir/parseConformance';
import {Fhir, Versions as FhirVersions} from 'fhir/fhir';
import * as path from 'path';
import * as zipdir from 'zip-dir';
import * as fs from 'fs-extra';
import {BadRequestException, HttpService, UnauthorizedException} from '@nestjs/common';
import {
  DomainResource as STU3DomainResource,
  ImplementationGuide as STU3ImplementationGuide,
  PackageResourceComponent
} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {
  DomainResource as R4DomainResource,
  ImplementationGuide as R4ImplementationGuide
} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {AxiosRequestConfig} from 'axios';
import {IUserSecurityInfo} from './base.controller';
import {addPermission, findPermission, parsePermissions} from '../../../../libs/tof-lib/src/lib/helper';
import {ConfigService} from './config.service';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';

export const zip = (p): Promise<any> => {
  return new Promise((resolve, reject) => {
    zipdir(p, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
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

export interface ParsedFhirUrl {
  resourceType?: string;
  id?: string;
  operation?: string;
  query?: { [key: string]: string|boolean };
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
  } else  {
    parts = url.split('/');
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

function getJsonFromFile(relativePath: string) {
  const actualPath = path.join(__dirname, relativePath);
  const contentStream = fs.readFileSync(actualPath);
  const content = contentStream.toString('utf8');
  return JSON.parse(content);
}

export function getFhirStu3Instance() {
  const parser = new ParseConformance(false, FhirVersions.STU3);
  const valueSets = getJsonFromFile('assets/stu3/valuesets.json');
  const types = getJsonFromFile('assets/stu3/profiles-types.json');
  const resources = getJsonFromFile('assets/stu3/profiles-resources.json');
  const iso3166 = getJsonFromFile('assets/stu3/codesystem-iso3166.json');

  parser.parseBundle(valueSets);
  parser.parseBundle(types);
  parser.parseBundle(resources);
  parser.loadCodeSystem(iso3166);

  return new Fhir(parser);
}

export function getFhirR4Instance() {
  const parser = new ParseConformance(false, FhirVersions.R4);
  const valueSets = getJsonFromFile('assets/r4/valuesets.json');
  const types = getJsonFromFile('assets/r4/profiles-types.json');
  const resources = getJsonFromFile('assets/r4/profiles-resources.json');
  const iso3166 = getJsonFromFile('assets/r4/codesystem-iso3166.json');

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
export async function addToImplementationGuide(httpService: HttpService, configService: ConfigService, fhirServerBase: string, fhirServerVersion: string, resource: STU3DomainResource | R4DomainResource, userSecurityInfo: IUserSecurityInfo, implementationGuide: string|STU3ImplementationGuide|R4ImplementationGuide, shouldPersistIg: boolean): Promise<void> {
  if (typeof implementationGuide === 'string' && shouldPersistIg) {
    throw new Error('Cannot persist the IG when it is passed as a string. It will not persisted elsewhere.');
  }

  // Don't add implementation guides to other implementation guides (or itself).
  if (resource.resourceType === 'ImplementationGuide') {
    return Promise.resolve();
  }

  let igUrl;
  let changed = false;
  const resourceReferenceString = `${resource.resourceType}/${resource.id}`;

  if (typeof implementationGuide === 'string') {
    const implementationGuideId = <string>implementationGuide;
    igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', implementationGuideId);

    const igResults = await httpService.get<STU3ImplementationGuide | R4ImplementationGuide>(igUrl).toPromise();
    implementationGuide = igResults.data;
  } else {
    igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', implementationGuide.id);
  }

  assertUserCanEdit(configService, userSecurityInfo, implementationGuide);

  if (fhirServerVersion !== 'stu3') {        // r4+
    const r4 = <R4ImplementationGuide>implementationGuide;

    r4.definition = r4.definition || {resource: []};
    r4.definition.resource = r4.definition.resource || [];

    const foundResource = r4.definition.resource.find((r) => {
      if (r.reference) {
        return r.reference.reference === resourceReferenceString;
      }
    });

    if (!foundResource) {
      const display = (<any>resource).title || (<any>resource).name;
      r4.definition.resource.push({
        reference: {
          reference: resourceReferenceString,
          display: display
        },
        exampleBoolean: Globals.profileTypes.concat(Globals.terminologyTypes).indexOf(resource.resourceType) < 0,
        name: display
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

    if (foundInPackages.length === 0) {
      const display = (<any>resource).title || (<any>resource).name;
      const newResource: PackageResourceComponent = {
        name: display,
        sourceReference: {
          reference: resourceReferenceString,
          display: display
        },
        example: Globals.profileTypes.concat(Globals.terminologyTypes).indexOf(resource.resourceType) < 0
      };

      if (stu3.package.length === 0) {
        stu3.package.push({
          name: 'Default Package',
          resource: [newResource]
        });
        changed = true;
      } else {
        if (!stu3.package[0].resource) {
          stu3.package[0].resource = [];
        }

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
      await httpService.request(updateOptions).toPromise();
    }
  }

  return Promise.resolve();
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
    addPermission(destination.meta, permission.type, permission.permission, permission.id);
  });
}
