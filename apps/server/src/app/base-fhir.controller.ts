import {BaseController} from './base.controller';
import {HttpService} from '@nestjs/common';
import {IFhirConfig} from './models/fhir-config';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {TofNotFoundException} from '../not-found-exception';
import {TofLogger} from './tof-logger';
import {AxiosRequestConfig} from 'axios';
import {ITofUser} from './models/tof-request';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {assertEditingAllowed, getUserSecurityInfo} from './security.helper';

import * as config from 'config';
import * as nanoid from 'nanoid';

const fhirConfig: IFhirConfig = config.get('fhir');

export class BaseFhirController extends BaseController {
  protected resourceType: string;
  protected readonly logger = new TofLogger(BaseFhirController.name);
  
  constructor(protected httpService: HttpService) {
    super();
  }

  protected async prepareSearchQuery(user: ITofUser, fhirServerBase: string, query?: any): Promise<any> {
    const userSecurityInfo = await getUserSecurityInfo(this.httpService, user, fhirServerBase);
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

  protected baseSearch(user: ITofUser, fhirServerBase: string, query?: any): Promise<any> {
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

  protected async baseGet(baseUrl, id: string, query?: any): Promise<any> {
    const options = <AxiosRequestConfig> {
      url: buildUrl(baseUrl, this.resourceType, id, null, query),
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    };

    try {
      const getResults = await this.httpService.request(options).toPromise();
      return getResults.data;
    } catch (ex) {
      if (ex.response.status === 404) {
        throw new TofNotFoundException();
      }
    }
  }

  protected baseCreate(baseUrl: string, data: any, query?: any) {
    return new Promise((resolve, reject) => {
      assertEditingAllowed(data);

      if (!data.id) {
        data.id = nanoid(8);
      }

      const existsOptions = <AxiosRequestConfig> {
        url: buildUrl(baseUrl, this.resourceType, data.id, null, { _summary: true }),
        method: 'GET'
      };

      // Make sure the resource doesn't already exist with the same id
      return this.httpService.request(existsOptions).toPromise()
        .then(() => {
          this.logger.error(`Attempted to create a ${this.resourceType} with an id of ${data.id} when it already exists`);
          reject(`A ${this.resourceType} already exists with the id ${data.id}`);
        })
        .catch((existsErr) => {
          if (existsErr.response && existsErr.response.status !== 404) {
            const msg = `An unexpected error code ${existsErr.statusCode} was returned when checking if a ${this.resourceType} already exists with the id ${data.id}`;
            this.logger.error(msg);
            return reject(msg);
          }

          const createOptions = <AxiosRequestConfig> {
            url: buildUrl(baseUrl, this.resourceType, data.id),
            method: 'PUT',
            data: data
          };

          // Create the resource
          return this.httpService.request(createOptions).toPromise()
            .then((results) => {
              const location = results.headers.location || results.headers['content-location'];

              if (location) {
                const getOptions = {
                  url: location,
                  method: 'GET'
                };

                // Get the saved version of the resource (with a unique id)
                return this.httpService.request(getOptions).toPromise();
              } else {
                throw new Error(`FHIR server did not respond with a location to the newly created ${this.resourceType}`);
              }
            })
            .then((newIgResults) => resolve(newIgResults.data))
            .catch((err) => reject(err));
        });
    });
  }

  protected baseUpdate(baseUrl: string, id: string, data: any, query?: any): Promise<any> {
    assertEditingAllowed(data);

    const options = <AxiosRequestConfig> {
      url: buildUrl(baseUrl, this.resourceType, id, null, query),
      method: 'PUT',
      data: data
    };

    return this.httpService.request(options).toPromise()
      .then((results) => results.data);
  }

  protected baseDelete(baseUrl: string, id: string, query?: any): Promise<any> {
    const getUrl = buildUrl(baseUrl, this.resourceType, id);

    return this.httpService.get(getUrl).toPromise()
      .then((resource) => {
        assertEditingAllowed(resource);

        const options = <AxiosRequestConfig> {
          url: buildUrl(baseUrl, this.resourceType, id, null, query),
          method: 'DELETE'
        };

        return this.httpService.request(options).toPromise();
      })
      .then((results) => results.data);
  }
}
