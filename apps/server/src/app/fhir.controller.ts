import {BaseController} from './base.controller';
import {
  All,
  BadRequestException, Body,
  Controller,
  Header,
  Headers,
  HttpCode,
  HttpService,
  InternalServerErrorException,
  Param,
  Post, Query,
  Res,
  UseGuards
} from '@nestjs/common';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Response} from 'express';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {ApiOAuth2Auth, ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, RequestMethod, RequestUrl} from './server.decorators';

@Controller('fhir')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('FHIR Proxy')
@ApiOAuth2Auth()
export class FhirController extends BaseController {
  private readonly logger = new TofLogger(FhirController.name);

  constructor(private httpService: HttpService) {
    super();
  }

  @Post(':resourceType/:id/([\$])change-id')
  @Header('Content-Type', 'text/plain')
  @HttpCode(200)
  @ApiOperation({ title: 'changeid', description: 'Changes the ID of a resource', operationId: 'changeId' })
  async changeId(@FhirServerBase() fhirServerBase: string, @Param('resourceType') resourceType: string, @Param('id') currentId: string, @Query('newId') newId: string): Promise<any> {
    if (!newId) {
      throw new BadRequestException('You must specify a "newId" to change the id of the resource');
    }

    const currentOptions = {
      url: buildUrl(fhirServerBase, resourceType, currentId),
      method: 'GET'
    };

    this.logger.log(`Request to change id for resource ${resourceType}/${currentId} to ${newId}`);

    // Get the current state of the resource
    const getResponse = await this.httpService.request(currentOptions).toPromise();
    const resource = getResponse.data;

    if (!resource || !resource.id) {
      throw new Error(`No resource found for ${resourceType} with id ${currentId}`);
    }

    // Change the id of the resource
    resource.id = newId;

    const createOptions = {
      url: buildUrl(fhirServerBase, resourceType, newId),
      method: 'PUT',
      data: resource
    };
    const deleteOptions = {
      url: buildUrl(fhirServerBase, resourceType, currentId),
      method: 'DELETE'
    };

    this.logger.log('Sending PUT request to FHIR server with the new resource ID');

    // Create the new resource with the new id
    await this.httpService.request(createOptions).toPromise();

    this.logger.log('Sending DELETE request to FHIR server for original resource');

    // Delete the original resource with the original id
    await this.httpService.request(deleteOptions).toPromise();

    this.logger.log(`Successfully changed the id of ${resourceType}/${currentId} to ${resourceType}/${newId}`);
    return `Successfully changed the id of ${resourceType}/${currentId} to ${resourceType}/${newId}`;
  }

  @All()
  public proxy(
    @RequestUrl() url: string,
    @Headers() headers: {[key: string]: any},
    @RequestMethod() method: string,
    @FhirServerBase() fhirServerBase: string,
    @Res() response: Response,
    @Body() body?) {

    let proxyUrl = fhirServerBase;

    if (proxyUrl.endsWith('/')) {
      proxyUrl = proxyUrl.substring(0, proxyUrl.length - 1);
    }

    proxyUrl += url;

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

    proxyHeaders['Cache-Control'] = 'no-cache';

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

    const sendResults = (results: AxiosResponse) => {
      if (results.headers['content-type']) {
        response.contentType(results.headers['content-type']);
      }

      response.status(results.status);
      response.send(results.data);
    };

    return this.httpService.request(options).toPromise()
      .then((results) => {
        sendResults(results);
      })
      .catch((err) => {
        const results = err.response;

        if (results) {
          sendResults(results);
        } else {
          this.logger.error('Error processing http-error results in proxy', err);
          throw new InternalServerErrorException();
        }
      });
  }
}
