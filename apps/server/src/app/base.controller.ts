import {Response} from 'express';
import {addPermission, findPermission, getErrorString} from '../../../../libs/tof-lib/src/lib/helper';
import {BadRequestException, HttpService, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {ITofRequest, ITofUser} from './models/tof-request';
import {TofLogger} from './tof-logger';
import {ConfigService} from './config.service';
import {Bundle, DomainResource, Group, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {AxiosRequestConfig} from 'axios';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';

export interface GenericResponse {
  status?: number;
  contentType?: string;
  contentDisposition?: string;
  content: any;
}

export interface UserSecurityInfo {
  user?: Practitioner;
  groups?: Group[];
}

export class BaseController {
  private static logger = new TofLogger(BaseController.name);

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

  protected assertAdmin(request: ITofRequest) {
    if (request.headers['admin-code'] !== this.configService.server.adminCode) {
      throw new UnauthorizedException('You are not authenticated as an admin');
    }
  }

  public async getMyPractitioner(user: ITofUser, fhirServerBase: string, resolveIfNotFound = false): Promise<Practitioner> {
    let system = '';
    let identifier = user.sub;

    if (identifier.startsWith('auth0|')) {
      system = Globals.authNamespace;
      identifier = identifier.substring(6);
    }

    BaseController.logger.log(`Getting Practitioner for user with identifier ${system}|${identifier}`);

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

    if (bundle.total === 0) {
      if (!resolveIfNotFound) {
        throw new BadRequestException('No practitioner was found associated with the authenticated user');
      } else {
        return;
      }
    }

    if (!bundle.entry) {
      throw new InternalServerErrorException('Expected to receive entries when searching for currently logged-in user within FHIR server');
    }

    if (bundle.total > 1) {
      new TofLogger('security.helper').error(`Expected a single Practitioner resource to be found with identifier ${system}|${identifier}`)
      throw new InternalServerErrorException();
    }

    return <Practitioner>bundle.entry[0].resource;
  }

  public async getUserSecurityInfo(user: ITofUser, fhirServerBase: string): Promise<UserSecurityInfo> {
    if (!this.configService.server.enableSecurity) {
      return Promise.resolve(null);
    }

    const userSecurityInfo: UserSecurityInfo = {
      user: await this.getMyPractitioner(user, fhirServerBase)
    };

    const groupsUrl = buildUrl(fhirServerBase, 'Group', null, null, {member: userSecurityInfo.user.id, _summary: true});
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
    if (!this.configService.server.enableSecurity || findPermission(resource.meta, 'everyone', 'read')) {
      return;
    }

    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);

    if (userSecurityInfo.user) {
      if (findPermission(resource.meta, 'user', 'read', userSecurityInfo.user.id)) {
        return;
      }
    }

    if (userSecurityInfo.groups) {
      const foundGroups = userSecurityInfo.groups.filter((group) => {
        return findPermission(resource.meta, 'group', 'read', group.id);
      });

      if (foundGroups.length > 0) {
        return;
      }
    }

    throw new UnauthorizedException();
  }

  public assertUserCanEdit(userSecurityInfo: UserSecurityInfo, resource: any) {
    if (this.configService.fhir && this.configService.fhir.nonEditableResources) {
      switch (resource.resourceType) {
        case 'CodeSystem':
          if (!this.configService.fhir.nonEditableResources.codeSystems) {
            return;
          }

          if (this.configService.fhir.nonEditableResources.codeSystems.indexOf(resource.url) >= 0) {
            throw new BadRequestException(`CodeSystem with URL ${resource.url} cannot be modified.`);
          }
          break;
      }
    }

    // security is not enabled
    if (!userSecurityInfo) {
      return;
    }

    if (findPermission(resource.meta, 'everyone', 'write')) {
      return;
    }

    if (userSecurityInfo.user) {
      if (findPermission(resource.meta, 'user', 'write', userSecurityInfo.user.id)) {
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

  protected userHasPermission(userSecurityInfo: UserSecurityInfo, permission: 'read'|'write', resource: DomainResource) {
    const foundEveryone = findPermission(resource.meta, 'everyone', permission);
    const foundGroup = userSecurityInfo.groups.find((group) => {
      return findPermission(resource.meta, 'group', permission, group.id);
    });
    const foundUser = findPermission(resource.meta, 'user', permission, userSecurityInfo.user.id);

    return foundEveryone || foundGroup || foundUser;
  }

  protected ensureUserCanEdit(userSecurityInfo: UserSecurityInfo, resource: DomainResource) {
    if (!this.configService.server.enableSecurity || !userSecurityInfo) {
      return;
    }

    resource.meta = resource.meta || {};
    resource.meta.security = resource.meta.security || [];

    // Make sure user can read
    if (!this.userHasPermission(userSecurityInfo, 'read', resource)) {
      addPermission(resource.meta, 'user', 'read', userSecurityInfo.user.id);
    }

    // Make sure user can write
    if (!this.userHasPermission(userSecurityInfo, 'write', resource)) {
      addPermission(resource.meta, 'user', 'write', userSecurityInfo.user.id);
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
}
