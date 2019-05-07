import {BaseController} from './base.controller';
import {BadRequestException, HttpService, InternalServerErrorException} from '@nestjs/common';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {TofNotFoundException} from '../not-found-exception';
import {TofLogger} from './tof-logger';
import {AxiosRequestConfig} from 'axios';
import {ITofUser} from './models/tof-request';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {Bundle, DomainResource} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ConfigService} from './config.service';

import nanoid from 'nanoid';

export class BaseFhirController extends BaseController {
  protected resourceType: string;
  protected readonly logger = new TofLogger(BaseFhirController.name);
  
  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }

  protected async prepareSearchQuery(user: ITofUser, fhirServerBase: string, query?: any): Promise<any> {
    const userSecurityInfo = this.configService.server.enableSecurity ?
      await this.getUserSecurityInfo(user, fhirServerBase) :
      null;
    const preparedQuery = query || {};
    preparedQuery['_summary'] = true;
    preparedQuery['_count'] = 10;

    if (preparedQuery.name) {
      preparedQuery['name:contains'] = preparedQuery.name;
      delete preparedQuery.name;
    }

    if (preparedQuery.title) {
      preparedQuery['title:contains'] = preparedQuery.title;
      delete preparedQuery.title;
    }

    if (preparedQuery.urlText) {
      preparedQuery.url = preparedQuery.urlText;
      delete preparedQuery.urlText;
    }

    if (preparedQuery.page) {
      if (parseInt(preparedQuery.page) !== 1) {
        preparedQuery._getpagesoffset = (parseInt(preparedQuery.page) - 1) * 10;
      }

      delete preparedQuery.page;
    }

    // Security search
    if (userSecurityInfo) {
      const securityTags = [`everyone${Globals.securityDelim}read`];

      if (userSecurityInfo.user) {
        securityTags.push(`user${Globals.securityDelim}${userSecurityInfo.user.id}${Globals.securityDelim}read`);
      }

      userSecurityInfo.groups.forEach((group) => {
        securityTags.push(`group${Globals.securityDelim}${group.id}${Globals.securityDelim}read`);
      });

      preparedQuery._security = securityTags;
    }

    return preparedQuery;
  }

  protected baseSearch(user: ITofUser, fhirServerBase: string, query?: any): Promise<Bundle> {
    return this.prepareSearchQuery(user, fhirServerBase, query)
      .then((preparedQuery) => {
        const options = <AxiosRequestConfig> {
          url: buildUrl(fhirServerBase, this.resourceType, null, null, preparedQuery),
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          }
        };

        return this.httpService.request(options).toPromise();
      })
      .then((results) => results.data);
  }

  protected async baseGet(baseUrl, id: string, query?: any, user?: ITofUser): Promise<any> {
    const options = <AxiosRequestConfig> {
      url: buildUrl(baseUrl, this.resourceType, id, null, query),
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    };

    try {
      const getResults = await this.httpService.request(options).toPromise();

      await this.assertViewingAllowed(getResults.data, user, baseUrl);

      return getResults.data;
    } catch (ex) {
      if (ex.response.status === 404) {
        throw new TofNotFoundException();
      } else {
        throw ex;
      }
    }
  }

  protected async baseCreate(baseUrl: string, data: DomainResource, user: ITofUser) {
    if (!data.resourceType) {
      throw new BadRequestException('Expected a FHIR resource');
    }

    const userSecurityInfo = await this.getUserSecurityInfo(user, baseUrl);
    this.ensureUserCanEdit(userSecurityInfo, data);

    if (!data.id) {
      data.id = nanoid(8);
    } else {
      // Make sure the resource doesn't already exist with the same id
      try {
        const existsOptions = <AxiosRequestConfig> {
          url: buildUrl(baseUrl, this.resourceType, data.id, null, { _summary: true }),
          method: 'GET'
        };

        await this.httpService.request(existsOptions).toPromise();
        this.logger.error(`Attempted to create a ${this.resourceType} with an id of ${data.id} when it already exists`);
        throw new BadRequestException(`A ${this.resourceType} already exists with the id ${data.id}`);
      } catch (ex) {
        // A 404 not found exception SHOULD be thrown
      }
    }

    const createOptions = <AxiosRequestConfig> {
      url: buildUrl(baseUrl, this.resourceType, data.id),
      method: 'PUT',
      data: data
    };

    // Create the resource
    const createResults = await this.httpService.request(createOptions).toPromise();
    const location = createResults.headers.location || createResults.headers['content-location'];

    if (location) {
      const getOptions = {
        url: location,
        method: 'GET'
      };

      // Get the saved version of the resource (with a unique id)
      const getResults = await this.httpService.request(getOptions).toPromise();
      return getResults.data;
    } else {
      throw new InternalServerErrorException(`FHIR server did not respond with a location to the newly created ${this.resourceType}`);
    }
  }

  protected async baseUpdate(baseUrl: string, id: string, data: any, user: ITofUser): Promise<any> {
    const userSecurityInfo = await this.getUserSecurityInfo(user, baseUrl);

    // Make sure the user can modify the resource based on the permissions
    // stored on the server, first
    try {
      this.logger.trace(`Getting existing ${this.resourceType} to check permissions`);
      const getOptions = <AxiosRequestConfig> {
        url: buildUrl(baseUrl, this.resourceType, id),
        method: 'GET'
      };
      const getResults = await this.httpService.request(getOptions).toPromise();

      this.logger.trace('Checking permissions');
      this.assertUserCanEdit(userSecurityInfo, getResults.data);
    } catch (ex) {
      // The resource doesn't exist yet and this is a create-on-update operation
    }

    // Make sure the user has granted themselves the ability to edit the resource
    // in the resource they're updating on the server
    this.logger.trace(`Checking that user has granted themselves permissions in the new version of the ${this.resourceType}`);
    this.assertUserCanEdit(userSecurityInfo, data);

    const options = <AxiosRequestConfig> {
      url: buildUrl(baseUrl, this.resourceType, id),
      method: 'PUT',
      data: data
    };

    this.logger.trace(`Updating the ${this.resourceType} on the FHIR server`);
    const updateResults = await this.httpService.request(options).toPromise();
    return updateResults.data;
  }

  protected async baseDelete(baseUrl: string, id: string, user: ITofUser): Promise<any> {
    const getUrl = buildUrl(baseUrl, this.resourceType, id);
    const getResults = await this.httpService.get(getUrl).toPromise();

    const userSecurityInfo = await this.getUserSecurityInfo(user, baseUrl);
    await this.assertUserCanEdit(userSecurityInfo, getResults.data);

    const options = <AxiosRequestConfig> {
      url: buildUrl(baseUrl, this.resourceType, id, null),
      method: 'DELETE'
    };

    const deleteResults = await this.httpService.request(options).toPromise();
    return deleteResults.data;
  }
}
