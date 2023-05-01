import {Response} from 'express';
import {addPermission, findPermission, getErrorString} from '../../../../libs/tof-lib/src/lib/helper';
import {HttpService} from '@nestjs/axios';
import {BadRequestException, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {TofLogger} from './tof-logger';
import {ConfigService} from './config.service';
import {Bundle, DomainResource, Group, Practitioner, ImplementationGuide as STU3ImplementationGuide} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {AxiosRequestConfig} from 'axios';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import type {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';
import {IPractitioner} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { IProject, IProjectResource } from '@trifolia-fhir/models';

export interface GenericResponse {
  status?: number;
  contentType?: string;
  contentDisposition?: string;
  content: any;
}

export interface IUserSecurityInfo {
  user?: ITofUser;
  practitioner?: IPractitioner;
  groups?: Group[];
}

export class BaseController {
  private static logger = new TofLogger(BaseController.name);
  private static practitionerCache: { [sub: string]: { retrieved: Date, practitioner: IPractitioner } } = {};
  private static readonly CacheMaxAge = 5*60*1000;    // 5 minutes

  constructor(protected configService: ConfigService, protected httpService: HttpService) {
  }

  protected static handleResponse(res: Response, actual: GenericResponse) {
    if (actual.contentType) {
      res.contentType(actual.contentType);
    }

    if (actual.contentDisposition) {
      res.setHeader('Content-Disposition', actual.contentDisposition);
    }

    res.status(actual.status || 200).send(actual.content);
  }

  protected static handleError(err, body?, res?, defaultMessage = 'An unknown error occurred') {
    const msg = getErrorString(err, body, defaultMessage);

    BaseController.logger.error(msg);

    if (res) {
      if (err && err.statusCode) {
        res.status(err.statusCode);
      } else {
        res.status(500);
      }

      res.send(msg);
    }
  }

  protected assertAdmin(user: ITofUser) {
    if (!user.isAdmin) {
      throw new UnauthorizedException('This operation requires administrative privileges.');
    }
  }

  public async getMyPractitioner(user: ITofUser, fhirServerBase: string, resolveIfNotFound = false): Promise<IPractitioner> {
    if (!user) return null;

    let system = Globals.defaultAuthNamespace;
    let identifier = user.sub;

    // Check if we already have a practitioner in the cache within the last CacheMaxAge
    if (BaseController.practitionerCache[identifier]) {
      const age = new Date().getTime() - BaseController.practitionerCache[identifier].retrieved.getTime();
      if (age < BaseController.CacheMaxAge) {
        return BaseController.practitionerCache[identifier].practitioner;
      }
    }

    if (identifier.startsWith('auth0|')) {
      system = Globals.authNamespace;
      identifier = identifier.substring(6);
    }

    BaseController.logger.debug(`Getting Practitioner for user with identifier ${system}|${identifier}`);

    const options = <AxiosRequestConfig>{
      url: buildUrl(fhirServerBase, 'Practitioner', null, null, {identifier: system + '|' + identifier}),
      headers: {
        'Cache-Control': 'no-cache'
      }
    };

    let bundle: Bundle;

    try {
      const results = await this.httpService.request<Bundle>(options).toPromise();
      bundle = results.data;
    } catch (ex) {
      BaseController.logger.error(`Error retrieving current user's Practitioner from FHIR server with URL "${options.url}": ${ex.message}`, ex.stack);
      throw ex;
    }

    if (!bundle.entry) {
      throw new InternalServerErrorException('Expected to receive entries when searching for currently logged-in user within FHIR server');
    }

    if (bundle.entry.length === 0) {
      if (!resolveIfNotFound) {
        throw new BadRequestException('No practitioner was found associated with the authenticated user');
      } else {
        return;
      }
    }

    if (bundle.entry.length > 1) {
      new TofLogger('security.helper').error(`Expected a single Practitioner resource to be found with identifier ${system}|${identifier}`);
      throw new InternalServerErrorException();
    }

    // Add the practitioner to the cache so that they don't have to be
    BaseController.practitionerCache[identifier] = {
      retrieved: new Date(),
      practitioner: bundle.entry[0].resource
    };

    return <Practitioner>bundle.entry[0].resource;
  }

  public async getUserSecurityInfo(user: ITofUser, fhirServerBase: string): Promise<IUserSecurityInfo> {
    if (!this.configService.server.enableSecurity) {
      return Promise.resolve(null);
    }

    const userSecurityInfo: IUserSecurityInfo = {
      user: user,
      practitioner: await this.getMyPractitioner(user, fhirServerBase)
    };

    const groupsUrl = buildUrl(fhirServerBase, 'Group', null, null, {member: userSecurityInfo.practitioner.id, _summary: true});
    const groupsOptions: AxiosRequestConfig = {
      url: groupsUrl,
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    };

    const groupsResults = await this.httpService.request<Bundle>(groupsOptions).toPromise();
    userSecurityInfo.groups = (groupsResults.data.entry || []).map((entry) => <Group>entry.resource);

    return userSecurityInfo;
  }

  public async assertViewingAllowed(resource: any, user: ITofUser, fhirServerBase: string) {
    // Don't bother... security is not enabled
    if (!this.configService.server.enableSecurity || user.isAdmin) {
      return;
    }

    // User is an admin, they should have access to everything
    if (user.isAdmin) {
      return;
    }

    // Resource allows everyone
    if (findPermission(resource.meta, 'everyone', 'read')) {
      return;
    }

    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);

    // Resource allows this user/practitioner
    if (userSecurityInfo.practitioner && findPermission(resource.meta, 'user', 'read', userSecurityInfo.practitioner.id)) {
      return;
    }

    const foundGroups = (userSecurityInfo.groups || []).filter((group) => {
      return findPermission(resource.meta, 'group', 'read', group.id);
    });

    // User is associated with a group that is permitted to view the resource
    if (foundGroups.length > 0) {
      return;
    }

    throw new UnauthorizedException();
  }

  protected userHasPermission(userSecurityInfo: IUserSecurityInfo, permission: 'read'|'write', resource: IProject|IProjectResource) {
    if (userSecurityInfo.user && userSecurityInfo.user.isAdmin) {
      return true;
    }

    const foundEveryone = findPermission(resource.permissions, 'everyone', permission);
    const foundGroup = userSecurityInfo.groups.find((group) => {
      return findPermission(resource.permissions, 'group', permission, group.id);
    });
    const foundUser = findPermission(resource.permissions, 'user', permission, userSecurityInfo.practitioner.id);

    return foundEveryone || foundGroup || foundUser;
  }

  /**
   * Adds the user to the resource for both read and write permissions, if the user doesn't
   * already have read/write permissions.
   * @param userSecurityInfo
   * @param resource
   */
  protected ensureUserCanEdit(userSecurityInfo: IUserSecurityInfo, resource: IProject|IProjectResource) {
    if (!this.configService.server.enableSecurity || !userSecurityInfo) {
      return;
    }

    // Don't need to add permissions for an admin user, because they already have access to everything
    if (userSecurityInfo.user && userSecurityInfo.user.isAdmin) {
      return;
    }

    resource.permissions = resource.permissions || [];

    // Make sure user can read
    if (!this.userHasPermission(userSecurityInfo, 'read', resource)) {
      addPermission(resource, 'user', 'read', userSecurityInfo.practitioner.id);
    }

    // Make sure user can write
    if (!this.userHasPermission(userSecurityInfo, 'write', resource)) {
      addPermission(resource, 'user', 'write', userSecurityInfo.practitioner.id);
    }
  }

  /**
   * Removes permissions from the original resource that are no longer specified
   * in the new resource (the resource sent by the user to overwrite the original).
   * @param fhirServiceBase
   * @param originalResource
   * @param newResource
   */
  protected async removePermissions(fhirServiceBase: string, originalResource: DomainResource, newResource: DomainResource) {
    if (!originalResource) {
      return;
    }

    const originalSecurity = originalResource.meta && originalResource.meta.security ?
      originalResource.meta.security : [];
    const newSecurity = newResource.meta && newResource.meta.security ?
      newResource.meta.security : [];
    const securitiesToRemove = originalSecurity.filter((security) => {
      // Only return security entries that are not found in the new resource
      return !newSecurity.find((next) => next.code === security.code);
    });
    const url = buildUrl(fhirServiceBase, newResource.resourceType, newResource.id, '$meta-delete');

    const promises = securitiesToRemove.map((securityToRemove) => {
      const parameters = {
        resourceType: 'Parameters',
        parameter: [{
          name: 'meta',
          valueMeta: {
            security: securityToRemove
          }
        }]
      };

      return this.httpService.post(url, parameters).toPromise();
    });

    return await Promise.all(promises);
  }

  /**
   * Removes references (any many as we are aware of) to the specified resource.
   * @param baseUrl The base url of the FHIR server to search on
   * @param fhirServerVersion The version of the currently selected FHIR server. This is needed to know what parameters to use, which vary from version to version.
   * @param resourceType The resource type of the resource that we want to find references to
   * @param id The id of the resource that we want to find references to
   */
  protected async removeReferencesToResource(baseUrl: string, fhirServerVersion: 'stu3'|'r4'|'r5', resourceType: string, id: string) {
    // Searches all properties of the object to find a property that has "reference" set to <resourceType>/<id>
    // The object/property that contains that "reference" property/value is returned.
    const findReference = (obj: any) => {
      if (!obj) return;

      if (obj.reference === `${resourceType}/${id}`) {
        return obj;
      }

      const propertyNames = Object.keys(obj);

      for (let i = 0; i < propertyNames.length; i++) {
        const propertyName = propertyNames[i];

        if (typeof obj[propertyName] === 'object') {
          const foundReference = findReference(obj[propertyName]);

          if (foundReference) {
            return foundReference;
          }
        }
      }
    };

    // Finds a reference to the resource in the specified object/resource and
    // deletes the reference/display from it.
    const deleteReferenceForResource = (resource: DomainResource) => {
      switch (resource.resourceType) {
        case 'ImplementationGuide':
          if (fhirServerVersion === 'stu3') {
            const stu3ImplementationGuide = <STU3ImplementationGuide> resource;

            // Remove package references
            (stu3ImplementationGuide.package || []).forEach(pkg => {
              const foundPkgReferences = (pkg.resource || []).filter(res => res.sourceReference && res.sourceReference.reference === `${resourceType}/${id}`);
              foundPkgReferences.forEach(res => pkg.resource.splice(pkg.resource.indexOf(res), 1));
            });

            // Remove global references
            (stu3ImplementationGuide.global || [])
              .filter(globalRef => globalRef.profile && globalRef.profile.reference === `${resourceType}/${id}`)
              .forEach(globalRef => stu3ImplementationGuide.global.splice(stu3ImplementationGuide.global.indexOf(globalRef), 1));
          } else if (fhirServerVersion === 'r4') {
            const r4ImplementationGuide = <R4ImplementationGuide> resource;

            if (r4ImplementationGuide.definition) {
              // Remove resource reference
              (r4ImplementationGuide.definition.resource || [])
                .filter(res => res.reference && res.reference.reference === `${resourceType}/${id}`)
                .forEach(res => r4ImplementationGuide.definition.resource.splice(r4ImplementationGuide.definition.resource.indexOf(res), 1));

              // Remove global references
              (r4ImplementationGuide.global || [])
                .filter(globalRef => globalRef.profile && globalRef.profile === `${resourceType}/${id}`)
                .forEach(globalRef => r4ImplementationGuide.global.splice(r4ImplementationGuide.global.indexOf(globalRef), 1));
            }
          } else {
            throw new Error(`Unexpected FHIR server version ${fhirServerVersion} found when deleting references to resource.`);
          }
          break;
        default:
          const foundReference = findReference(resource);

          if (!foundReference) {
            console.error('Expected to find a reference to the resource!');
            return;
          }

          // Remove the reference and display from the reference, leaving it empty.
          delete foundReference.reference;
          delete foundReference.display;
          break;
      }
    };

    // Queries the server for the specified resource type, using the search parameter
    // to search for the resource by reference.
    const searchForReference = (searchResourceType: string, searchParameter: string) => {
      return new Promise(async (resolve) => {
        const params = {};    // DONT use _summary=true. The results may end up getting used to update the resource.
        params[searchParameter] = `${resourceType}/${id}`;
        const searchUrl = buildUrl(baseUrl, searchResourceType, null, null, params);

        const results = await this.httpService.get(searchUrl).toPromise();
        const bundle: Bundle = results.data;
        const resources = (bundle.entry || []).map(entry => <DomainResource> entry.resource);

        resolve(resources);
      });
    };

    const searchPromises = [];

    // These search parameters apply to both STU3 and R4 servers
    searchPromises.push(searchForReference('ImplementationGuide', 'resource'));

    // Apply R4-specific search parameters
    if (fhirServerVersion === 'r4') {
      searchPromises.push(searchForReference('ImplementationGuide', 'global'));
    }

    // Concatenate all results into a single array of resources that reference the target
    const allResults = await Promise.all(searchPromises);
    const allResources = allResults.reduce((prev, curr) => {
      return prev.concat(curr);
    }, []);

    // Delete any references to the target resource
    allResources.forEach(resource => deleteReferenceForResource(resource));

    // Persist the changes to the resources
    if (allResources.length > 0) {
      const transaction = new Bundle();
      transaction.type = 'transaction';
      transaction.entry = allResources.map((resource) => {
        return {
          resource: resource,
          fullUrl: buildUrl(baseUrl, resource.resourceType, resource.id),
          request: {
            method: 'PUT',
            url: `${resource.resourceType}/${resource.id}`
          }
        };
      });

      await this.httpService.post<Bundle>(baseUrl, transaction).toPromise();
    }
  }

  protected async getImplementationGuide(fhirServerBase: string, contextImplementationGuideId: string): Promise<STU3ImplementationGuide | R4ImplementationGuide> {
    if (!contextImplementationGuideId) {
      return Promise.resolve(undefined);
    }

    const igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', contextImplementationGuideId);
    const results = await this.httpService.get<STU3ImplementationGuide | R4ImplementationGuide>(igUrl).toPromise();
    return results.data;
  }
}
