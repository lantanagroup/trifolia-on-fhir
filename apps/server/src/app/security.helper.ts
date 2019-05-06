import {ITofUser} from './models/tof-request';
import {Bundle, Group, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {BadRequestException, HttpService, InternalServerErrorException, Logger, UnauthorizedException} from '@nestjs/common';
import {AxiosRequestConfig} from 'axios';
import {IServerConfig} from './models/server-config';
import {IFhirConfig} from './models/fhir-config';

import * as config from 'config';
import {findPermission} from '../../../../libs/tof-lib/src/lib/helper';

const serverConfig: IServerConfig = config.get('server');
const fhirConfig: IFhirConfig = config.get('fhir');
const logger = new Logger('security.helper');

export interface UserSecurityInfo {
  user?: Practitioner;
  groups?: Group[];
}

export async function getMyPractitioner(httpService: HttpService, user: ITofUser, fhirServerBase: string, resolveIfNotFound = false): Promise<Practitioner> {
  let system = '';
  let identifier = user.sub;

  if (identifier.startsWith('auth0|')) {
    system = 'https://auth0.com';
    identifier = identifier.substring(6);
  }

  const options = <AxiosRequestConfig>{
    url: buildUrl(fhirServerBase, 'Practitioner', null, null, {identifier: system + '|' + identifier}),
    headers: {
      'Cache-Control': 'no-cache'
    }
  };

  const results = await httpService.request<Bundle>(options).toPromise();
  const bundle = results.data;

  if (bundle.total === 0) {
    if (!resolveIfNotFound) {
      throw new BadRequestException('No practitioner was found associated with the authenticated user');
    } else {
      return;
    }
  }

  if (bundle.total > 1) {
    logger.error(`Expected a single Practitioner resource to be found with identifier ${system}|${identifier}`)
    throw new InternalServerErrorException();
  }

  return <Practitioner> bundle.entry[0].resource;
}

export async function getUserSecurityInfo(httpService: HttpService, user: ITofUser, fhirServerBase: string): Promise<UserSecurityInfo> {
  if (!serverConfig.enableSecurity) {
    return Promise.resolve(null);
  }

  const userSecurityInfo: UserSecurityInfo = {
    user: await getMyPractitioner(httpService, user, fhirServerBase)
  };

  const groupsUrl = buildUrl(fhirServerBase, 'Group', null, null, {member: userSecurityInfo.user.id, _summary: true});
  const groupsOptions = {
    url: groupsUrl,
    method: 'GET',
    json: true,
    headers: {
      'Cache-Control': 'no-cache'
    }
  };

  const groupsResults = await httpService.request<Bundle>(groupsOptions).toPromise();
  userSecurityInfo.groups = (groupsResults.data.entry || []).map((entry) => <Group>entry.resource);

  return userSecurityInfo;
}

export async function assertViewingAllowed(resource: any, httpService: HttpService, user: ITofUser, fhirServerBase: string) {
  if (!serverConfig.enableSecurity || findPermission(resource.meta, 'everyone', 'read')) {
    return;
  }

  const userSecurityInfo = await getUserSecurityInfo(httpService, user, fhirServerBase);

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

export async function assertEditingAllowed(resource: any, httpService?: HttpService, user?: ITofUser, fhirServerBase?: string) {
  if (!resource || !fhirConfig.nonEditableResources) {
    return;
  }

  switch (resource.resourceType) {
    case 'CodeSystem':
      if (!fhirConfig.nonEditableResources.codeSystems) {
        return;
      }

      if (fhirConfig.nonEditableResources.codeSystems.indexOf(resource.url) >= 0) {
        throw new BadRequestException(`CodeSystem with URL ${resource.url} cannot be modified.`);
      }
      break;
  }

  if (!serverConfig.enableSecurity || !httpService || !fhirServerBase || !user) {
    return;
  }

  if (findPermission(resource.meta, 'everyone', 'write')) {
    return;
  }

  const userSecurityInfo = await getUserSecurityInfo(httpService, user, fhirServerBase);

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
