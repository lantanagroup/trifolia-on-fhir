import {BaseController} from './base.controller';
import {HttpService, Logger} from '@nestjs/common';
import * as config from 'config';
import {IFhirConfig} from './models/fhir-config';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import * as nanoid from 'nanoid';
import {TofNotFoundException} from '../not-found-exception';

const fhirConfig: IFhirConfig = config.get('fhir');

export class BaseFhirController extends BaseController {
  protected resourceType: string;
  protected readonly logger = new Logger(BaseFhirController.name);
  
  constructor(protected httpService: HttpService) {
    super();
  }
  
  protected assertEditingAllowed(resource: any) {
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

  protected prepareSearchQuery(query?: any): Promise<any> {
    return new Promise((resolve, reject) => {
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

      resolve(preparedQuery);
    });
  }

  protected baseSearch(baseUrl, query?: any): Promise<any> {
    return this.prepareSearchQuery(query)
      .then((preparedQuery) => {
        const url = buildUrl(baseUrl, this.resourceType, null, null, preparedQuery);
        const options = {
          url: url,
          method: 'GET',
          json: true,
          headers: {
            'Cache-Control': 'no-cache'
          }
        };

        return this.httpService.request(options).toPromise();
      })
      .then((results) => results.data);
  }

  protected async baseGet(baseUrl, id: string, query?: any): Promise<any> {
    const url = buildUrl(baseUrl, this.resourceType, id, null, query);
    const options = {
      url: url,
      method: 'GET',
      json: true,
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
      this.assertEditingAllowed(data);

      if (!data.id) {
        data.id = nanoid(8);
      }

      const existsOptions = {
        url: buildUrl(baseUrl, this.resourceType, data.id, null, { _summary: true }),
        method: 'GET',
        json: true
      };

      // Make sure the resource doesn't already exist with the same id
      return this.httpService.request(existsOptions).toPromise()
        .then(() => {
          this.logger.error(`Attempted to create a ${this.resourceType} with an id of ${data.id} when it already exists`);
          reject(`A ${this.resourceType} already exists with the id ${data.id}`);
        })
        .catch((existsErr) => {
          if (existsErr.statusCode !== 404) {
            const msg = `An unexpected error code ${existsErr.statusCode} was returned when checking if a ${this.resourceType} already exists with the id ${data.id}`;
            this.logger.error(msg);
            return reject(msg);
          }

          const url = buildUrl(baseUrl, this.resourceType, data.id);
          const createOptions = {
            url: url,
            method: 'PUT',
            json: true,
            body: data,
            resolveWithFullResponse: true
          };

          // Create the resource
          return this.httpService.request(createOptions).toPromise()
            .then((results) => {
              const location = results.headers.location || results.headers['content-location'];

              if (location) {
                const getOptions = {
                  url: location,
                  method: 'GET',
                  json: true
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
    this.assertEditingAllowed(data);

    const url = buildUrl(baseUrl, this.resourceType, id, null, query);
    const options = {
      url: url,
      method: 'PUT',
      json: true,
      body: data
    };

    return this.httpService.request(options).toPromise()
      .then((results) => results.data);
  }

  protected baseDelete(baseUrl: string, id: string, query?: any): Promise<any> {
    const getUrl = buildUrl(baseUrl, this.resourceType, id);

    return this.httpService.get(getUrl).toPromise()
      .then((resource) => {
        this.assertEditingAllowed(resource);

        const deleteUrl = buildUrl(baseUrl, this.resourceType, id, null, query);
        const options = {
          url: deleteUrl,
          method: 'DELETE',
          json: true
        };

        return this.httpService.request(options).toPromise();
      })
      .then((results) => results.data);
  }
}
