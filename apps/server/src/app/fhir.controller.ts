import { BaseController, IUserSecurityInfo } from './base.controller';
import {
  All,
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpService,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { buildUrl, createOperationOutcome, generateId, getR4Dependencies, getSTU3Dependencies } from '../../../../libs/tof-lib/src/lib/fhirHelper';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TofLogger } from './tof-logger';
import { AxiosRequestConfig } from 'axios';
import { ApiOAuth2, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FhirServerBase, FhirServerVersion, RequestHeaders, RequestMethod, RequestUrl, User } from './server.decorators';
import { ConfigService } from './config.service';
import { Globals } from '../../../../libs/tof-lib/src/lib/globals';
import { addToImplementationGuide, assertUserCanEdit, copyPermissions, createAuditEvent, parseFhirUrl } from './helper';
import { Bundle, DomainResource, EntryComponent, ImplementationGuide as STU3ImplementationGuide } from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import { ImplementationGuide as R4ImplementationGuide, OperationOutcome } from '../../../../libs/tof-lib/src/lib/r4/fhir';
import { format as formatUrl, parse as parseUrl, UrlWithStringQuery } from 'url';
import { ITofUser } from '../../../../libs/tof-lib/src/lib/tof-user';
import { default as PQueue } from 'p-queue';
import { IBundle, IImplementationGuide, IOperationOutcome, IStructureDefinition } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { ImplementationGuideController } from './implementation-guide.controller';

export interface ProxyResponse {
  status: number;
  data: any;
  contentType?: string;
}

@Controller('api/fhir')
@UseGuards(AuthGuard('bearer'))
@ApiTags('FHIR Proxy')
@ApiOAuth2([])
export class FhirController extends BaseController {
  private readonly logger = new TofLogger(FhirController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }



  @Get(':resourceType/:id/([\$])list-ig')
  @Header('Content-Type', 'text/plain')
  @HttpCode(200)
  @ApiOperation({ summary: 'listIg', description: 'List Ig ', operationId: 'listIg' })
  async listIg(@FhirServerBase() fhirServerBase: string, @Param('resourceType') resourceType: string, @Param('id') id: string, @RequestHeaders('implementationGuideId') contextImplementationGuideId): Promise<boolean> {

    const res = resourceType + "/" + id;
    const currentOptions: AxiosRequestConfig = {
      url: buildUrl(fhirServerBase, 'ImplementationGuide', null, null, { resource: res }),
      method: 'GET'
    };

    // Get the all the implementation guides for that resource
    try {
      const getResponse = await this.httpService.request(currentOptions).toPromise();
      const bundle:Bundle = getResponse.data;
      if (bundle.entry.length >= 2 || bundle.entry.length === 1 && contextImplementationGuideId !== bundle.entry[0].resource.id) {
        return true;
      }
    } catch (ex) {
      this.logger.error(`Error from FHIR server when getting current resource to change the resource's id: ${ex.message}`);
    }

    return false;
  }



  @Post(':resourceType/:id/([\$])change-id')
  @Header('Content-Type', 'text/plain')
  @HttpCode(200)
  @ApiOperation({ summary: 'changeid', description: 'Changes the ID of a resource', operationId: 'changeId' })
  async changeId(@FhirServerBase() fhirServerBase: string, @Param('resourceType') resourceType: string, @Param('id') currentId: string,
                 @Query('newId') newId: string, @User() user: ITofUser, @RequestHeaders('implementationGuideId') contextImplementationGuideId,
                 @FhirServerVersion() fhirVersion: 'stu3'|'r4'): Promise<any> {
    if (!newId) {
      throw new BadRequestException('You must specify a "newId" to change the id of the resource');
    }

    let resource;
    const currentOptions: AxiosRequestConfig = {
      url: buildUrl(fhirServerBase, resourceType, currentId),
      method: 'GET'
    };

    this.logger.log(`Request to change id for resource ${resourceType}/${currentId} to ${newId}`);

    // Get the current state of the resource
    try {
      const getResponse = await this.httpService.request(currentOptions).toPromise();
      resource = getResponse.data;
    } catch (ex) {
      this.logger.error(`Error from FHIR server when getting current resource to change the resource's id: ${ex.message}`);
    }

    if (!resource || !resource.id) {
      throw new Error(`No resource found for ${resourceType} with id ${currentId}`);
    }

    // Make sure the resource can be edited, by the user
    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);
    assertUserCanEdit(this.configService, userSecurityInfo, resource);

    // Change the id of the resource
    resource.id = newId;

    const createOptions: AxiosRequestConfig = {
      url: buildUrl(fhirServerBase, resourceType, newId),
      method: 'PUT',
      data: resource
    };
    const checkOptions: AxiosRequestConfig = {
      url: buildUrl(fhirServerBase, resourceType, newId),
      method: 'GET'
    };
    const deleteOptions: AxiosRequestConfig = {
      url: buildUrl(fhirServerBase, resourceType, currentId),
      method: 'DELETE'
    };

    this.logger.log(`Sending GET request to FHIR server to check existence for new resource id of type ${resourceType}`);
    try{
      await this.httpService.request(checkOptions).toPromise();
      this.logger.error(`Resource id ${newId} already exists`);
      return `Resource id ${newId} already exists`;
    }catch (ex){
      if(ex.response && ex.response.status !== 404 && ex.response.status !== 410){
        throw ex;
      }
    }

    this.logger.log('Sending DELETE request to FHIR server for original resource');

    // Delete the original resource with the original id
    await this.httpService.request(deleteOptions).toPromise();

    try {
      // Create the new resource with the new id
      await this.httpService.request(createOptions).toPromise();
    } catch (ex) {
      this.logger.error(`Error from FHIR server when creating the new resource to change the resource\'s id: ${ex.message}`);
      throw ex;
    }

    const searchForReference = (searchResourceType: string, searchParameter: string) => {

      return new Promise(async (resolve) => {
        const params = {};    // DONT use _summary=true. The results may end up getting used to update the resource.
        params[searchParameter] = `${resourceType}/${currentId}`;
        const searchUrl = buildUrl(fhirServerBase, searchResourceType, null, null, params);

        const results = await this.httpService.get(searchUrl).toPromise();
        const bundle: Bundle = results.data;
        const resources = (bundle.entry || []).map(entry => <DomainResource> entry.resource);

        resolve(resources);
      });
    };

    const allResults = [];
    // These search parameters apply to both STU3 and R4 servers
    allResults.push(await searchForReference('ImplementationGuide', 'resource'));
    if (fhirVersion === 'r4') {
      allResults.push(await searchForReference('ImplementationGuide', 'global'));
    }

    let igFound = false;
    allResults.forEach(result => {
      if(!igFound){
        result.forEach(r => {
          if(r.id === contextImplementationGuideId && r.resourceType === "ImplementationGuide"){
            igFound = true;
          }
        });
      }
    });

    if (contextImplementationGuideId && !igFound) {
      allResults.push(await this.getImplementationGuide(fhirServerBase, contextImplementationGuideId));
    }

    const allResources = allResults.reduce((prev, curr) => {
      return prev.concat(curr);
    }, []);

    let references: any[] = [];
    const findReferences = (obj: any) => {
      if (!obj) return;

      if (obj.hasOwnProperty("reference") && obj.reference === `${resourceType}/${currentId}`) {
        references.push(obj);
      }

      const propertyNames = Object.keys(obj);

      for (let i = 0; i < propertyNames.length; i++) {
        const propertyName = propertyNames[i];

        if (typeof obj[propertyName] === 'object') {
          findReferences(obj[propertyName]);
        }
      }
      return;
    };

    allResults.forEach(result => {
      references = [];
      findReferences(result);
      if (references.length > 0) {
        const anyResource = <any> resource;
        references.forEach(foundReference => {
          foundReference.reference =  `${resourceType}/${newId}`;
          if (anyResource.title) {
            foundReference.display = anyResource.title;
          } else if (typeof anyResource.name === 'string') {
            foundReference.display = anyResource.name;
          }
        });
      }
    });

    // Persist the changes to the resources
    if (allResources.length > 0) {
      const transaction = new Bundle();
      transaction.type = 'transaction';
      transaction.entry = allResources.map((r) => {
        return {
          resource: r,
          fullUrl: buildUrl(fhirServerBase, r.resourceType, r.id),
          request: {
            method: 'PUT',
            url: `${r.resourceType}/${r.id}`
          }
        };
      });

      try{
        await this.httpService.post<Bundle>(fhirServerBase, transaction).toPromise();
      }
      catch(ex){
        this.logger.error(`Error from FHIR server when persisting changes to the resources: ${ex.message}`);
        throw ex;
      }
    }

    this.logger.log(`Successfully changed the id of ${resourceType}/${currentId} to ${resourceType}/${newId}`);
    return `Successfully changed the id of ${resourceType}/${currentId} to ${resourceType}/${newId}`;
  }

  /**
   * Processes an individual entry in the batch.
   * If the resource already exists, checks permissions to make sure the user can edit.
   * @param entry The entry to process.
   * @param fhirServerBase The base address of the fhir server.
   * @param fhirServerVersion The version of the fhir server.
   * @param userSecurityInfo The security info for the currently logged-in user.
   * @param contextImplementationGuide The implementation guide this batch should be int he context of. Ensures the entry/resource is added to the ig.
   * @param shouldRemovePermissions Indicates if permissions should be removed as part of this batch process. Some scenarios (such as importing) don't want permissions removed.
   * @param applyContextPermissions Indicates if created/updated resources should apply permissions from the context implementation guide
   */
  private async processBatchEntry(
    entry: EntryComponent,
    fhirServerBase: string,
    fhirServerVersion: 'stu3' | 'r4',
    userSecurityInfo: IUserSecurityInfo,
    contextImplementationGuide?: STU3ImplementationGuide | R4ImplementationGuide,
    shouldRemovePermissions = true,
    applyContextPermissions = false) {

    if(entry.resource && entry.resource.resourceType === "StructureDefinition"){
      delete (<IStructureDefinition> entry.resource).snapshot;
    }

    // Make sure the user has permission to edit the pre-existing resource
    if (entry.request.method !== 'POST') {
      const id = entry.resource.id;

      if (!id) {
        throw new BadRequestException('Batch entry with a request method of PUT must specify Resource.id');
      }

      if (this.configService.server.enableSecurity) {
        let originalResource;
        const getUrl = buildUrl(fhirServerBase, entry.resource.resourceType, entry.resource.id);

        try {
          this.logger.log(`Retrieving existing resource and checking security for ${entry.resource.resourceType}/${entry.resource.id}`);
          originalResource = (await this.httpService.get<DomainResource>(getUrl).toPromise()).data;

          assertUserCanEdit(this.configService, userSecurityInfo, originalResource);
        } catch (ex) {
          if (ex.response) {
            if (ex.response.status === 404 || ex.response.status === 410) {
              // Do nothing... It doesn't exist or has been deleted, so the user can create it.
            } else if (ex.status === 401) {
              return {
                status: 401,
                data: createOperationOutcome('fatal', 'forbidden', 'You do not have permissions to update this resource.')
              };
            } else if (ex.response.status !== 404) {
              let msg = `Expected either 200 or 404. Received ${ex.status} with error '${ex.message}'`;

              if (ex.response.data && ex.response.data.resourceType === 'OperationOutcome') {
                const oo = <IOperationOutcome> ex.response.data;
                if (oo.issue && oo.issue.length > 0) {
                  const newMsg = oo.issue.map(i => i.diagnostics).join(' \n');

                  if (newMsg) {
                    msg = newMsg;
                  }
                }
              }

              return {
                status: ex.response.status,
                data: createOperationOutcome('fatal', 'processing', msg)
              };
            }
          } else {
            this.logger.error(`A generic error occurred while attempting to confirm that the user can edit the resource in the transaction entry: ${ex.message}`);
            return {
              status: ex.response.status,
              data: createOperationOutcome('fatal', 'processing', `A generic error occurred while attempting to confirm that the user can edit the resource in the transaction entry: ${ex.message}`)
            };
          }
          // Do nothing if the resource is not found... That means this is a create-with-id request
        }

        if (originalResource && shouldRemovePermissions) {
          try {
            await this.removePermissions(fhirServerBase, originalResource, entry.resource);
          } catch (ex) {
            this.logger.error(`Error occurred while removing permissions for resource in transaction: ${ex.message}`, ex.stack);
            throw ex;
          }
        }

        // Make sure the user has given themselves permissions to edit
        // the resource they are requesting to be updated
        if (!originalResource && entry.resource) {
          this.ensureUserCanEdit(userSecurityInfo, entry.resource);
        }

        // Copy the permissions from the context ig to the entry/resource
        if (applyContextPermissions) {
          copyPermissions(contextImplementationGuide, entry.resource);
        }
      }
    }

    if (entry.request.method === 'POST' && !entry.resource.id) {
      entry.resource.id = generateId();
    }

    const url = fhirServerBase +
      (!fhirServerBase.endsWith('/') ? '/' : '') +
      (entry.request.url.startsWith('/') ? entry.request.url.substring(1) : entry.request.url);
    const options: AxiosRequestConfig = {
      url: url,
      method: entry.request.method,
      data: entry.resource
    };

    let batchProcessingResponse;

    try {
      this.logger.log(`Sending ${entry.request.method} request for ${entry.resource.resourceType}${entry.resource.id ? '/' + entry.resource.id : ''} to FHIR server.`);
      batchProcessingResponse = await this.httpService.request(options).toPromise();
    } catch (ex) {
      this.logger.error(`Error occurred while updating resource '${url}' in transaction entry: ${ex.message}`, ex.stack);

      if (ex.response) {
        return ex.response;
      }

      throw ex;
    }

    if (contextImplementationGuide) {
      this.logger.trace(`Batch is being processed within the context of the IG "${contextImplementationGuide.id}. Ensuring the resource is added to the IG.`);
      await addToImplementationGuide(this.httpService, this.configService, fhirServerBase, fhirServerVersion, batchProcessingResponse.data, userSecurityInfo, contextImplementationGuide, false);
      // TODO: Handle DELETE events (remove the resource from the IG).
    }

    let action = '';
    if(entry.request.method === 'POST'){
      action = 'C';
    }else if(entry.request.method === 'GET'){
      action = 'R';
    }else if(entry.request.method === 'PUT'){
      action = 'U';
    }else if(entry.request.method.indexOf('DEL') > 0){
      action = 'D';
    }

    createAuditEvent(this.logger, this.httpService, fhirServerVersion, fhirServerBase, action, userSecurityInfo, batchProcessingResponse.data);

    return batchProcessingResponse;
  }

  /**
   * Process a Bundle[type='batch'] of resources
   * @param bundle The bundle to process
   * @param fhirServerBase The base address of the fhir server
   * @param fhirServerVersion The version of the fhir server
   * @param userSecurityInfo The security info about the currently logged-in user
   * @param contextImplementationGuide
   * @param shouldRemovePermissions Indicates if permissions should be removed from resources in the batch if the original resource has permissions that aren't in the request
   * @param applyContextPermissions Indicates if created/updated resources should apply permissions from the context implementation guide
   */
  private async processBatch(
    bundle: Bundle,
    fhirServerBase: string,
    fhirServerVersion: 'stu3'|'r4',
    userSecurityInfo: IUserSecurityInfo,
    contextImplementationGuide?: STU3ImplementationGuide | R4ImplementationGuide,
    shouldRemovePermissions = true,
    applyContextPermissions = false) {

    if (!bundle || bundle.resourceType !== 'Bundle') {
      throw new BadRequestException(`Expected the resource to be a Bundle, got ${bundle.resourceType}.`);
    }

    if (bundle.type !== 'batch') {
      throw new BadRequestException('Trifolia-on-FHIR only supports Bundles of type "batch".');
    }

    // Make sure each entry has a request.url
    (bundle.entry || []).forEach((entry, index) => {
      if (!entry.request || !entry.request.url || !entry.request.method) {
        throw new BadRequestException('Transaction entries must have an request.url and request.method');
      } else if (['GET','POST','PUT','DELETE'].indexOf(entry.request.method) < 0) {
        throw new BadRequestException(`Transaction entry[${index}] method must be GET, POST, PUT or DELETE`);
      }
    });

    const contextImplementationGuideUrl = contextImplementationGuide ? buildUrl(fhirServerBase, 'ImplementationGuide', contextImplementationGuide.id) : null;

    // Uses promise-queue to throttle the number of requests that can be sent to the FHIR server at the same time
    const queue = new PQueue({ concurrency: this.configService.server.maxAsyncQueueRequests });
    const results = [];

    (bundle.entry || []).forEach((entry) => {
      queue.add(async () => {
        const next = await this.processBatchEntry(entry, fhirServerBase, fhirServerVersion, userSecurityInfo, contextImplementationGuide, shouldRemovePermissions, applyContextPermissions);
        results.push(next);
      });
    });
    await queue.onIdle();

    // Now that processing the batch entries is done, persist the context IG back to the server
    if (contextImplementationGuide) {
      this.logger.trace(`Updating the context implementation guide ${contextImplementationGuide.id} for the batch.`);
      await this.httpService.put(contextImplementationGuideUrl, contextImplementationGuide).toPromise();
    }

    const responseBundle: Bundle = {
      resourceType: 'Bundle',
      type: 'batch-response'
    };

    responseBundle.entry = results.map((result, index) => {
      const responseEntry = <EntryComponent> {
        request: {
          method: bundle.entry[index].request.method,
          url: bundle.entry[index].request.url
        },
        response: {
          status: result.status.toString() + (result.statusText ? ' ' + result.statusText : ''),
          location: result.headers ? result.headers['content-location'] : undefined
        }
      };

      if (result.data && result.data.resourceType === 'OperationOutcome') {
        responseEntry.response.outcome = result.data;
      } else {
        if (result.data && result.data.resourceType) {
          responseEntry.response.outcome = createOperationOutcome('information', 'informational', `Successfully created/updated resource ${result.data.resourceType}/${result.data.id}`)
        } else {
          responseEntry.response.outcome = createOperationOutcome('information', 'informational', 'Successfully created/updated resource.')
        }
      }

      return responseEntry;
    });

    return responseBundle;
  }

  /**
   * Proxies the request through the selected/specified FHIR server
   * @param url The full url of the request to proxy. This will be modified to use a different base address for the proxying fhir server.
   * @param headers Headers for the proxy request. Some headers may be deleted to make the proxy work.
   * @param method The method of the request to be proxied.
   * @param fhirServerBase The base address of the fhir server
   * @param fhirServerVersion The version of the fhir server
   * @param user The ToF user that is making this request
   * @param body The data being proxied in the request
   * @param shouldRemovePermissions Indicates if permissions should be removed from resources in the batch if the original resource has permissions that aren't in the request
   * @param applyContextPermissions Indicates if created/updated resources should apply permissions from the context implementation guide
   */
  public async proxy(
    url: string,
    headers: {[key: string]: any},
    method: string,
    fhirServerBase: string,
    fhirServerVersion: 'stu3'|'r4',
    user: ITofUser,
    body?,
    shouldRemovePermissions = true,
    applyContextPermissions = false): Promise<ProxyResponse> {

    if (!user) {
      throw new UnauthorizedException();
    }

    headers = headers || {};

    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);
    const userIsAdmin = userSecurityInfo && userSecurityInfo.user && userSecurityInfo.user.isAdmin;
    let proxyUrl = fhirServerBase;

    if (proxyUrl.endsWith('/')) {
      proxyUrl = proxyUrl.substring(0, proxyUrl.length - 1);
    }

    proxyUrl += url;

    if (method === 'GET' && headers['implementationguideid']) {
      const parsed: UrlWithStringQuery = parseUrl(proxyUrl);

      if (!parsed.search) {
        parsed.search = '';
      }

      if (parsed.search && !parsed.search.endsWith('&')) {
        parsed.search += '&';
      }

      parsed.search += `_has:ImplementationGuide:resource:_id=${encodeURIComponent(headers['implementationguideid'])}`;
      proxyUrl = formatUrl(parsed);
    }

    const parsedUrl = parseFhirUrl(url);
    const isBatch = body && body.resourceType === 'Bundle' && body.type === 'batch';
    const contextImplementationGuide = headers.implementationguideid ? await this.getImplementationGuide(fhirServerBase, headers.implementationguideid) : undefined;

    if (isBatch && !parsedUrl.resourceType) {
      // When dealing with a transaction, process each individual resource within the bundle
      try {
        const responseBundle = await this.processBatch(body, fhirServerBase, fhirServerVersion, userSecurityInfo, contextImplementationGuide, shouldRemovePermissions, applyContextPermissions);
        return {
          status: 200,
          data: responseBundle
        };
      } catch (ex) {
        this.logger.error(`Error processing transaction in FHIR Proxy: ${ex.message}`, ex.stack);
        throw ex;
      }
    } else if (method === 'GET' && parsedUrl.resourceType && !parsedUrl.id && !parsedUrl.operation) {
      // When searching, add _security query parameter
      if (this.configService.server.enableSecurity) {
        // Security search
        if (userSecurityInfo && !userIsAdmin) {
          const securityTags = [`everyone${Globals.securityDelim}read`];

          if (userSecurityInfo.practitioner) {
            securityTags.push(`user${Globals.securityDelim}${userSecurityInfo.practitioner.id}${Globals.securityDelim}read`);
          }

          userSecurityInfo.groups.forEach((group) => {
            securityTags.push(`group${Globals.securityDelim}${group.id}${Globals.securityDelim}read`);
          });

          const securityQueryValue = securityTags.join(',');

          // Make sure the url deliminates query params
          if (proxyUrl.indexOf('?') < 0) {
            proxyUrl += '?';
          }

          // If there are already query params in the url, add another query param deliminator
          if (!proxyUrl.endsWith('?')) {
            proxyUrl += '&';
          }

          // Add the _security query param to the url
          proxyUrl += '_security=' + encodeURIComponent(securityQueryValue);
        }
      }
    } else if (method === 'POST') {
      // When creating, make sure permissions are assigned to the new resource
      if (this.configService.server.enableSecurity) {
        this.ensureUserCanEdit(userSecurityInfo, body);

        // Copy permissions from the context implementation guide
        if (applyContextPermissions) {
          copyPermissions(contextImplementationGuide, body);
        }
      }
    } else if (method === 'PUT' || method === 'DELETE') {
      // When updating, make sure the user can modify the resource in question
      if (this.configService.server.enableSecurity) {
        try {
          const getUrl = buildUrl(fhirServerBase, parsedUrl.resourceType, parsedUrl.id);
          const persistedResource = (await this.httpService.get<DomainResource>(getUrl).toPromise()).data;

          if (method === 'PUT' && body) {
            await this.removePermissions(fhirServerBase, persistedResource, body);
          }

          assertUserCanEdit(this.configService, userSecurityInfo, persistedResource);
        } catch (ex) {
          if (ex.response && ex.response.status !== 404) {
            throw ex;
          }
          // Do nothing if the resource is not found... That means this is a create-with-id request
        }

        if (body) {
          this.ensureUserCanEdit(userSecurityInfo, body);

          if (applyContextPermissions) {
            copyPermissions(contextImplementationGuide, body);
          }
        }
      }

      // Update resources that reference what we're about to delete
      if (method === 'DELETE') {
        await this.removeReferencesToResource(fhirServerBase, fhirServerVersion, parsedUrl.resourceType, parsedUrl.id);
      }
    }

    const proxyHeaders = JSON.parse(JSON.stringify(headers));
    delete proxyHeaders['authorization'];
    delete proxyHeaders['fhirserver'];
    delete proxyHeaders['host'];
    delete proxyHeaders['origin'];
    delete proxyHeaders['referer'];
    delete proxyHeaders['user-agent'];
    delete proxyHeaders['content-length'];
    delete proxyHeaders['cookie'];
    delete proxyHeaders['connection'];
    delete proxyHeaders['implementationguideid'];

    // Make sure that caching is turned off for proxied FHIR requests
    proxyHeaders['Cache-Control'] = 'no-cache';

    if (method === 'PATCH') {
      if (proxyHeaders['content-type'] === 'application/json') {
        proxyHeaders['content-type'] = 'application/json-patch+json';
      } else if (proxyHeaders['content-type'] === 'application/xml') {
        proxyHeaders['content-type'] = 'application/xml-patch+xml';
      }
    }

    const options = <AxiosRequestConfig> {
      url: proxyUrl,
      method: method,
      headers: proxyHeaders,
      encoding: 'utf8',
      gzip: false
    };

    if (method !== 'GET' && method !== 'DELETE' && body) {
      options.data = body;
    }

    try {
      const results = await this.httpService.request(options).toPromise();

      // If there is a context implementation guide and this request was for a single resource
      // (indicated by the fact that the results returned a resource with an id) then add
      // the resource to the implementation guide
      if (contextImplementationGuide && results.data.resourceType && results.data.id && ['POST', 'PUT'].indexOf(method) >= 0) {
        await addToImplementationGuide(this.httpService, this.configService, fhirServerBase, fhirServerVersion, results.data, userSecurityInfo, contextImplementationGuide,true);
      }

      let action = '';
      if (method === 'POST') {
        action = 'C';
      } else if (method === 'GET') {
        action = 'R';
      } else if (method === 'PUT' || method === 'PATCH') {
        action = 'U';
      } else if (method.indexOf('DEL') > 0) {
        action = 'D';
      }

      createAuditEvent(this.logger, this.httpService, fhirServerVersion, fhirServerBase, action, userSecurityInfo, results.data);

      return {
        status: results.status,
        contentType: results.headers['content-type'] || null,
        data: results.data
      };
    } catch (ex) {
      const results = ex.response;

      if (results) {
        return {
          status: results && results.statusCode ? results.statusCode : 500,
          contentType: results && results.headers ? results.headers['content-type'] || null : null,
          data: results && results.error ? results.error : 'Unknown error occurred'
        };
      } else {
        this.logger.error(`Error (status ${ex.status} processing http-error results in proxy: ${ex.message}`, ex);
        throw new InternalServerErrorException();
      }
    }
  }

  @Get('dependency')
  public async searchDependency(
    @FhirServerBase() fhirServerBase,
    @Headers('implementationguideid') implementationGuideId: string,
    @FhirServerVersion() fhirServerVersion: 'stu3'|'r4',
    @Query('resourceType') resourceType?: string,
    @Query('_id') resourceId?: string,
    @Query('name') name?: string,
    @Query('title') title?: string,
    @Query('_content') resourceContent?: string,
    @Query('type') structureDefinitionType?: string,
    @Query('url') structureDefinitionUrl?: string,
    @Query('isLightweight') isLightweight = true) {
    const igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', implementationGuideId);
    const igResults = await this.httpService.get<IImplementationGuide>(igUrl).toPromise();
    const ig = igResults.data;
    let dependencies: string[];

    await ImplementationGuideController.downloadDependencies(ig, fhirServerVersion, this.configService, this.logger);

    switch (fhirServerVersion) {
      case 'stu3':
        dependencies = getSTU3Dependencies(<STU3ImplementationGuide> ig);
        break;
      case 'r4':
        dependencies = getR4Dependencies(<R4ImplementationGuide> ig);
        break;
      default:
        throw new Error(`Unexpected FHIR server version ${fhirServerVersion}`);
    }

    const responseBundle: IBundle = {
      resourceType: 'Bundle',
      entry: []
    };

    for (const dependency of dependencies) {
      const dependencyDir = path.join(os.homedir(), '.fhir', 'packages', dependency, 'package');
      if (!fs.existsSync(dependencyDir)) {
        this.logger.error(`Could not find downloaded dependency ${dependency} for IG ${implementationGuideId}`);
        continue;
      }

      const packageFiles = fs.readdirSync(dependencyDir);

      for (const packageFile of packageFiles) {
        if (!packageFile.toLowerCase().endsWith('.json')) continue;

        const fileContent = fs.readFileSync(path.join(dependencyDir, packageFile)).toString();
        const resource = JSON.parse(fileContent);

        if (!resource.resourceType) continue;

        // Filter resource type that doesn't match
        if (resourceType && resource.resourceType !== resourceType) continue;

        // id
        if (resourceId && resource.id !== resourceId) continue;

        // title
        if (title) {
          const resourceTitle = resource.title || '';

          if (resourceTitle.toLowerCase().indexOf(title.toLowerCase()) < 0) continue;
        }

        // name
        if (name) {
          let resourceName = resource.name || '';

          // name might be a complex object... convert it to a json string and search within it
          if (typeof resourceName !== 'string') {
            resourceName = JSON.stringify(resourceName);
          }

          if (resourceName.toLowerCase().indexOf(name.toLowerCase()) < 0) continue;
        }

        // _content search
        if (resourceContent && fileContent.toLowerCase().indexOf(resourceContent.toLowerCase()) < 0) continue;

        // structureDefinitionUrl. this applies in structure-definition.controller.ts when retrieving dependencies
        if (structureDefinitionUrl && resource.resourceType === 'StructureDefinition') {
          const structureDefinition = <IStructureDefinition> resource;
          if (!structureDefinition.url || structureDefinition.url !== structureDefinitionUrl) continue;
        }

        // type (only applies to StructureDefinition)
        if (structureDefinitionType && resource.resourceType === 'StructureDefinition') {
          const structureDefinition = <IStructureDefinition> resource;

          if (!structureDefinition.type || structureDefinition.type !== structureDefinitionType) continue;
        }

        if (!isLightweight) {
          responseBundle.entry.push({
            resource: <any>{
              resourceType: resource.resourceType,
              id: resource.id,
              name: resource.name,
              url: resource.url,
              resource: resource
            }
          });
        } else {
          responseBundle.entry.push({
            resource: <any>{
              resourceType: resource.resourceType,
              id: resource.id,
              name: resource.name,
              url: resource.url
            }
          });
        }
      }
    }

    return responseBundle;
  }

  @All()
  public async proxyRequest(
    @RequestUrl() url: string,
    @Headers() headers: {[key: string]: any},
    @RequestMethod() method: string,
    @FhirServerBase() fhirServerBase: string,
    @FhirServerVersion() fhirServerVersion: 'stu3'|'r4',
    @Res() response: Response,
    @User() user: ITofUser,
    @Body() body?) {

    const shouldRemovePermissions = headers['shouldremovepermissions'] ? headers['shouldremovepermissions'].toLowerCase() === 'true' : true;
    const applyContextPermissions = url.indexOf("applyContextPermissions=true") > -1;
    const results = await this.proxy(url, headers, method, fhirServerBase, fhirServerVersion, user, body, shouldRemovePermissions, applyContextPermissions);

    response.status(results.status);

    if (results.contentType) {
      response.contentType(results.contentType);
    }

    response.send(results.data);
  }
}
