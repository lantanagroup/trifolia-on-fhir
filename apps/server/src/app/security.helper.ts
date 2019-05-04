import {ITofUser} from './models/tof-request';
import {Bundle, Group, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {BadRequestException, HttpService, InternalServerErrorException, Logger} from '@nestjs/common';
import {AxiosRequestConfig} from 'axios';
import {IServerConfig} from './models/server-config';
import {IFhirConfig} from './models/fhir-config';

import * as config from 'config';

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

export function assertEditingAllowed(resource: any) {
  if (!resource || !fhirConfig.nonEditableResources) {
    return;
  }

  switch (resource.resourceType) {
    case 'CodeSystem':
      if (!fhirConfig.nonEditableResources.codeSystems) {
        return;
      }

      if (fhirConfig.nonEditableResources.codeSystems.indexOf(resource.url) >= 0) {
        throw new Error(`CodeSystem with URL ${resource.url} cannot be modified.`);
      }
      break;
  }
}
