import {BaseController} from './base.controller';
import {BadRequestException, HttpService, InternalServerErrorException} from '@nestjs/common';
import {buildUrl, generateId} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {TofNotFoundException} from '../not-found-exception';
import {TofLogger} from './tof-logger';
import {AxiosRequestConfig} from 'axios';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {Bundle, DomainResource} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ConfigService} from './config.service';
import {getErrorString} from '../../../../libs/tof-lib/src/lib/helper';
import {addToImplementationGuide, assertUserCanEdit, copyPermissions, createAuditEvent} from './helper';
import {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';
import {
  SearchImplementationGuideResponse,
  SearchImplementationGuideResponseContainer
} from '../../../../libs/tof-lib/src/lib/searchIGResponse-model';
import * as fs from 'fs-extra';
import {ImplementationGuide} from '../../../../libs/tof-lib/src/lib/r4/fhir';


export class BaseFhirController extends BaseController {
  protected resourceType: string;
  protected readonly logger = new TofLogger(BaseFhirController.name);

  constructor(protected httpService: HttpService,
              protected configService: ConfigService) {
    super(configService, httpService);
  }

  protected async prepareSearchQuery(user: ITofUser, fhirServerBase: string, query?: any, headers?: { [key: string]: string}): Promise<any> {
    const userSecurityInfo = this.configService.server.enableSecurity ?
      await this.getUserSecurityInfo(user, fhirServerBase) :
      null;
    const preparedQuery = query || {};
    preparedQuery['_summary'] = true;
    preparedQuery['_count'] = 10;

    if (headers && headers['implementationguideid'] && !preparedQuery.implementationGuideId) {
      preparedQuery['_has:ImplementationGuide:resource:_id'] = headers['implementationguideid'];
    } else if (preparedQuery.implementationGuideId) {
      preparedQuery['_has:ImplementationGuide:resource:_id'] = preparedQuery.implementationGuideId;
      delete preparedQuery.implementationGuideId;
    }

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
      if (Number(preparedQuery.page) !== 1) {
        preparedQuery._getpagesoffset = (Number(preparedQuery.page) - 1) * 10;
      }

      delete preparedQuery.page;
    }

    // Security search
    if (userSecurityInfo && !user.isAdmin) {
      const securityTags = [`everyone${Globals.securityDelim}read`];

      if (userSecurityInfo.practitioner) {
        securityTags.push(`user${Globals.securityDelim}${userSecurityInfo.practitioner.id}${Globals.securityDelim}read`);
      }

      userSecurityInfo.groups.forEach((group) => {
        securityTags.push(`group${Globals.securityDelim}${group.id}${Globals.securityDelim}read`);
      });

      preparedQuery._security = securityTags;
    }

    return preparedQuery;
  }

  protected async baseSearch(user: ITofUser, fhirServerBase: string, query?: any, headers?: { [key: string]: string}): Promise<Bundle> {
    const preparedQuery = await this.prepareSearchQuery(user, fhirServerBase, query, headers);

    const options = <AxiosRequestConfig> {
      url: buildUrl(fhirServerBase, this.resourceType, null, null, preparedQuery),
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    };

    try {
      const results = await this.httpService.request(options).toPromise();
      return results.data;
    } catch (ex) {
      let message = `Failed to search for resource type ${this.resourceType}: ${ex.message}`;

      if (ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome') {
        message = getErrorString(null, ex.response.data);
        this.logger.error(message, ex.stack);
        throw new InternalServerErrorException(message);
      }

      this.logger.error(message, ex.stack);
      throw ex;
    }
  }

  public getPublishStatus(implementationGuideId: string): boolean{
    let publishStatuses: { [implementationGuideId: string]: boolean } = {};
    if (fs.existsSync(this.configService.server.publishStatusPath)) {
      publishStatuses = JSON.parse(fs.readFileSync(this.configService.server.publishStatusPath).toString());
    }
    return publishStatuses.hasOwnProperty(implementationGuideId) ? publishStatuses[implementationGuideId] : null;
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
      if (ex.response && ex.response.status === 404) {
        throw new TofNotFoundException();
      } else if (ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome') {
          const message = getErrorString(null, ex.response.data);
          this.logger.error(message, ex.stack);
          throw new InternalServerErrorException(message);
      } else {
        throw ex;
      }
    }
  }

  protected async baseCreate(fhirServerBase: string, fhirServerVersion: string, data: DomainResource, user: ITofUser, contextImplementationGuideId?: string, applyContextPermissions = true) {
    if (!data.resourceType) {
      throw new BadRequestException('Expected a FHIR resource');
    }

    if (!data.meta || Object.keys(data.meta).length === 0) {
      delete data.meta;
    }

    let alreadyExists = false;
    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);
    const contextImplementationGuide = await this.getImplementationGuide(fhirServerBase, contextImplementationGuideId);

    this.ensureUserCanEdit(userSecurityInfo, data);

    if (!data.id) {
      data.id = generateId();
    } else {
      // Make sure the resource doesn't already exist with the same id
      try {
        const existsOptions = <AxiosRequestConfig> {
          url: buildUrl(fhirServerBase, this.resourceType, data.id, null, { _summary: true }),
          method: 'GET'
        };

        await this.httpService.request(existsOptions).toPromise();
        this.logger.error(`Attempted to create a ${this.resourceType} with an id of ${data.id} when it already exists`);

        alreadyExists = true;
      } catch (ex) {
        // A 404 not found exception SHOULD be thrown
      }

      if (alreadyExists) {
        throw new BadRequestException(`A ${this.resourceType} already exists with the id ${data.id}`);
      }
    }

    // Copy the permissions from the context IG if requested
    if (contextImplementationGuide && applyContextPermissions) {
      copyPermissions(contextImplementationGuide, data);
    }

    const createOptions = <AxiosRequestConfig> {
      url: buildUrl(fhirServerBase, this.resourceType, data.id),
      method: 'PUT',
      data: data
    };

    // Create the resource
    let createResults;

    try {
      createResults = await this.httpService.request(createOptions).toPromise();
    } catch (ex) {
      let message = `Failed to create resource ${this.resourceType}: ${ex.message}`;

      if (ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome') {
        message = getErrorString(null, ex.response.data);
        this.logger.error(message, ex.stack);
        throw new InternalServerErrorException(message);
      }

      this.logger.error(message, ex.stack);
      throw ex;
    }

    const location = createResults.headers.location || createResults.headers['content-location'];

    if (location) {
      const getOptions: AxiosRequestConfig = {
        url: location,
        method: 'GET'
      };

      // Get the saved version of the resource (with a unique id)
      const getResults = await this.httpService.request(getOptions).toPromise();
      const resource = getResults.data;

      // If we're in the context of an IG and the resource is not another IG or security-related resources
      // Then add the resource to the IG
      if (contextImplementationGuide) {
        await addToImplementationGuide(this.httpService, this.configService, fhirServerBase, fhirServerVersion, resource, userSecurityInfo, contextImplementationGuide, true);
      }

      createAuditEvent(this.logger, this.httpService, fhirServerVersion, fhirServerBase, "C", userSecurityInfo, resource);

      return resource;
    } else {
      throw new InternalServerErrorException(`FHIR server did not respond with a location to the newly created ${this.resourceType}`);
    }
  }

  protected async baseUpdate(fhirServerBase: string, fhirServerVersion: string, id: string, data: any, user: ITofUser, contextImplementationGuideId?: string, applyContextPermissions = false): Promise<any> {
    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);
    const contextImplementationGuide = await this.getImplementationGuide(fhirServerBase, contextImplementationGuideId);
    let original;

    // Make sure the user can modify the resource based on the permissions
    // stored on the server, first
    try {
      this.logger.trace(`Getting existing ${this.resourceType} to check permissions`);
      const getOptions = <AxiosRequestConfig> {
        url: buildUrl(fhirServerBase, this.resourceType, id),
        method: 'GET'
      };
      const getResults = await this.httpService.request(getOptions).toPromise();
      original = getResults.data;

      this.logger.trace('Checking permissions');
      assertUserCanEdit(this.configService, userSecurityInfo, original);
    } catch (ex) {
      // The resource doesn't exist yet and this is a create-on-update operation
    }

    // Copy the permissions from the context IG if requested
    if (contextImplementationGuide && applyContextPermissions) {
      copyPermissions(contextImplementationGuide, data);
    }

    // Make sure the user has granted themselves the ability to edit the resource
    // in the resource they're updating on the server
    this.logger.trace(`Checking that user has granted themselves permissions in the new version of the ${this.resourceType}`);
    assertUserCanEdit(this.configService, userSecurityInfo, data);

    const resourceUrl = buildUrl(fhirServerBase, this.resourceType, id);
    const options = <AxiosRequestConfig> {
      url: resourceUrl,
      method: 'PUT',
      data: data
    };

    this.logger.trace(`Updating the ${this.resourceType} on the FHIR server`);

    try {
      const updateResults = await this.httpService.request(options).toPromise();
      const resource = updateResults.data;

      if (fhirServerVersion === 'r4' && contextImplementationGuide) {
        const ig = contextImplementationGuide as ImplementationGuide;
        const resources = ig.definition && ig.definition.resource ? ig.definition.resource : [];
        const index = resources.findIndex(r => {
          return r.reference.reference.indexOf(id) > 0;
        });

        if (index >= 0 && (data.title || data.name)) {
          //If data.title exists, set to data.title. Else if data.name exists, set to data.name. Else if data.title and data.name don't exist, do nothing.
          (<ImplementationGuide>contextImplementationGuide).definition.resource[index].name =
            data.title ? data.title : data.name;

          const igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', contextImplementationGuideId);
          await this.httpService.put<ImplementationGuide>(igUrl, contextImplementationGuide).toPromise();
        }
      }

      // If we're in the context of an IG and the resource is not another IG or security-related resources
      // Then add the resource to the IG
      if (contextImplementationGuide) {
        await addToImplementationGuide(this.httpService, this.configService, fhirServerBase, fhirServerVersion, resource, userSecurityInfo, contextImplementationGuide, true);
      }

      // If this resource existed before now, we should make sure we remove permissions from it as appropriate.
      if (original) {
        // have to use "original" because HAPI (maybe other servers) return what you send to it during the update
        // which is the same as the "data" variable. Need to get what is actually on the server, which is "original"
        this.removePermissions(fhirServerBase, original, data);
      }

      const updatedResults = await this.httpService.get(resourceUrl).toPromise();

      createAuditEvent(this.logger, this.httpService, fhirServerVersion, fhirServerBase, "U", userSecurityInfo, resource);

      return updatedResults.data;
    } catch (ex) {
      let message = `Failed to update resource ${this.resourceType}/${id}: ${ex.message}`;

      if (ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome') {
        message = getErrorString(null, ex.response.data);
        this.logger.error(message, ex.stack);
        throw new InternalServerErrorException(message);
      }

      this.logger.error(message, ex.stack);
      throw ex;
    }
  }

  protected async baseDelete(baseUrl: string, fhirServerVersion: 'stu3'|'r4', id: string, user: ITofUser): Promise<any> {
    const getUrl = buildUrl(baseUrl, this.resourceType, id);
    const getResults = await this.httpService.get(getUrl).toPromise();

    const userSecurityInfo = await this.getUserSecurityInfo(user, baseUrl);
    await assertUserCanEdit(this.configService, userSecurityInfo, getResults.data);

    // TODO: Update 'r4' to actual server version
    await this.removeReferencesToResource(baseUrl, fhirServerVersion, this.resourceType, id);

    const options = <AxiosRequestConfig> {
      url: buildUrl(baseUrl, this.resourceType, id, null),
      method: 'DELETE'
    };

    try {
      const deleteResults = await this.httpService.request(options).toPromise();

      createAuditEvent(this.logger, this.httpService, fhirServerVersion, baseUrl, "D", userSecurityInfo, deleteResults.data);

      return deleteResults.data;
    } catch (ex) {
      let message = `Failed to delete resource ${this.resourceType}/${id}: ${ex.message}`;

      if (ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome') {
        message = getErrorString(null, ex.response.data);
        this.logger.error(message, ex.stack);
        throw new InternalServerErrorException(message);
      }

      this.logger.error(message, ex.stack);
      throw ex;
    }
  }
}
