import {BaseFhirController} from './base-fhir.controller';
import {BadRequestException, Body, Controller, Delete, Get, HttpService, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Bundle, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {AxiosRequestConfig} from 'axios';
import * as nanoid from 'nanoid';
import {ApiImplicitQuery, ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';

@Controller('practitioner')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Practitioner')
@ApiOAuth2Auth()
export class PractitionerController extends BaseFhirController {
  resourceType = 'Practitioner';

  protected readonly logger = new TofLogger(PractitionerController.name);
  
  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  @Post('me')
  public updateMyPractitioner(@Req() request: ITofRequest, @Body() practitioner: Practitioner): Promise<any> {
    return this.getMyPractitioner(request, true)
      .then((existingPractitioner) => {
        const authUser = request.user.sub;
        let system = '';
        let value = authUser;

        if (authUser.startsWith('auth0|')) {
          system =  'https://auth0.com';
          value = authUser.substring(6);
        }

        if (!practitioner.identifier) {
          practitioner.identifier = [];
        }

        const foundIdentifier = practitioner.identifier.find((identifier) => {
          return identifier.system === system && identifier.value === value;
        });

        if (!foundIdentifier) {
          practitioner.identifier.push({
            system: system,
            value: value
          });
        }

        if (existingPractitioner && existingPractitioner.id) {
          practitioner.id = existingPractitioner.id;
        } else {
          practitioner.id = nanoid(8);
        }

        const practitionerRequest = {
          url: buildUrl(request.fhirServerBase, this.resourceType, practitioner.id),
          method: 'PUT',
          data: practitioner
        };

        return this.httpService.request(practitionerRequest).toPromise();
      })
      .then((results) => {
        const location = results.headers.location || results.headers['content-location'];

        if (!location) {
          throw new Error(`FHIR server did not respond with a location to the newly created ${this.resourceType}`);
        }

        const options = <AxiosRequestConfig> {
          url: location,
          method: 'GET'
        };

        return this.httpService.request(options).toPromise();
      })
      .then((results) => results);
  }

  @Get('me')
  public getMyPractitioner(@Req() request: ITofRequest, @Query('resolveIfNotFound') resolveIfNotFound = false): Promise<any> {
    let system = '';
    let identifier = request.user.sub;

    if (identifier.startsWith('auth0|')) {
      system =  'https://auth0.com';
      identifier = identifier.substring(6);
    }

    const options = <AxiosRequestConfig> {
      url: buildUrl(request.fhirServerBase, this.resourceType, null, null, { identifier: system + '|' + identifier }),
      headers: {
        'Cache-Control': 'no-cache'
      }
    };

    return this.httpService.request<Bundle>(options).toPromise()
      .then((results) => {
        const bundle = results.data;

        if (bundle.total === 0) {
          if (!resolveIfNotFound) {
            throw new BadRequestException('No practitioner was found associated with the authenticated user');
          } else {
            return;
          }
        }

        if (bundle.total > 1) {
          this.logger.log(`Expected a single ${this.resourceType} resource to be found with identifier ${system}|${identifier}`)
        }

        return bundle.entry[0].resource;
      });
  }

  @Get()
  @ApiImplicitQuery({ name: 'name', type: 'string', required: false, description: 'Filter results by name' })
  public search(@Req() request: ITofRequest, @Query() query?: any): Promise<any> {
    return super.baseSearch(request.fhirServerBase, query);
  }

  @Get(':id')
  public get(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseGet(request.fhirServerBase, id, request.query);
  }

  @Post()
  public create(@Req() request: ITofRequest, @Body() body) {
    return super.baseCreate(request.fhirServerBase, body, request.query);
  }

  @Put(':id')
  public update(@Req() request: ITofRequest, @Param('id') id: string, @Body() body) {
    return super.baseUpdate(request.fhirServerBase, id, body, request.query);
  }

  @Delete(':id')
  public delete(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseDelete(request.fhirServerBase, id, request.query);
  }
}
