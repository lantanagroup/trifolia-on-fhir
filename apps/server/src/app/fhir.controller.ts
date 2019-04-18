import {BaseController} from './base.controller';
import {All, BadRequestException, Controller, Get, HttpService, Param, Req, UseGuards} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {map} from 'rxjs/operators';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';

@Controller('fhir')
@UseGuards(AuthGuard('bearer'))
export class FhirController extends BaseController {
  private readonly logger = new TofLogger(FhirController.name);

  constructor(private httpService: HttpService) {
    super();
  }

  @All()
  public proxy(@Req() request: ITofRequest) {
    let proxyUrl = request.fhirServerBase;

    if (proxyUrl.endsWith('/')) {
      proxyUrl = proxyUrl.substring(0, proxyUrl.length - 1);
    }

    proxyUrl += request.url;

    const proxyHeaders = JSON.parse(JSON.stringify(request.headers));
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

    const options = {
      url: proxyUrl,
      method: request.method,
      headers: proxyHeaders,
      body: undefined,
      encoding: 'utf8',
      gzip: false,
      json: false
    };

    if (request.method !== 'GET' && request.method !== 'DELETE') {
      options.body = request.body;
      options.json = typeof request.body === 'object';
    }

    if (proxyHeaders['accept-encoding'] && proxyHeaders['accept-encoding'].indexOf('gzip') >= 0) {
      options.gzip = true;
    }


    return this.httpService.request(options).pipe(
      map(response => response.data)
    );
  }

  @Get('/:resourceType/:id/([\$])change-id')
  changeId(@Req() request: ITofRequest, @Param('resourceType') resourceType: string, @Param('id') currentId: string): Promise<any> {
    const newId = request.query.newId;
    
    return new Promise((resolve, reject) => {
      if (!newId) {
        throw new BadRequestException('You must specify a "newId" to change the id of the resource');
      }

      const currentOptions = {
        url: buildUrl(request.fhirServerBase, resourceType, currentId),
        method: 'GET',
        json: true
      };

      this.logger.log(`Request to change id for resource ${resourceType}/${currentId} to ${newId}`);

      // Get the current state of the resource
      this.httpService.request(currentOptions).toPromise()
        .then((results) => {
          const resource = results.data;

          if (!resource || !resource.id) {
            throw new Error(`No resource found for ${resourceType} with id ${currentId}`);
          }

          // Change the id of the resource
          resource.id = newId;

          const createOptions = {
            url: buildUrl(request.fhirServerBase, resourceType, newId),
            method: 'PUT',
            json: true,
            body: resource
          };

          this.logger.log('Sending PUT request to FHIR server with the new resource ID');

          // Create the new resource with the new id
          return this.httpService.request(createOptions).toPromise();
        })
        .then(() => {
          const deleteOptions = {
            url: buildUrl(request.fhirServerBase, resourceType, currentId),
            method: 'DELETE',
            json: true
          };

          this.logger.log('Sending DELETE request to FHIR server for original resource');

          // Delete the original resource with the original id
          return this.httpService.request(deleteOptions).toPromise();
        })
        .then(() => {
          this.logger.log(`Successfully changed the id of ${resourceType}/${currentId} to ${resourceType}/${newId}`);
          resolve(`Successfully changed the id of ${resourceType}/${currentId} to ${resourceType}/${newId}`);
        })
        .catch((err) => reject(err));
    });
  }
}
