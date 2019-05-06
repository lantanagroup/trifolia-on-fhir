import {BaseFhirController} from './base-fhir.controller';
import {BadRequestException, Body, Controller, Delete, Get, HttpService, InternalServerErrorException, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ITofRequest, ITofUser} from './models/tof-request';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Bundle, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {AxiosRequestConfig} from 'axios';
import * as nanoid from 'nanoid';
import {ApiImplicitQuery, ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, User} from './server.decorators';
import {getMyPractitioner} from './security.helper';

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
  public updateMyPractitioner(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Body() practitioner: Practitioner): Promise<any> {
    return this.getMyPractitioner(user, fhirServerBase, true)
      .then((existingPractitioner) => {
        const authUser = user.sub;
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
          url: buildUrl(fhirServerBase, this.resourceType, practitioner.id),
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
      .then((results) => results.data);
  }

  @Get('me')
  public async getMyPractitioner(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Query('resolveIfNotFound') resolveIfNotFound = false): Promise<Practitioner> {
    return getMyPractitioner(this.httpService, user, fhirServerBase, resolveIfNotFound);
  }

  @Get()
  @ApiImplicitQuery({ name: 'name', type: 'string', required: false, description: 'Filter results by name' })
  public search(@User() user, @FhirServerBase() fhirServerBase, @Query() query?: any): Promise<any> {
    return super.baseSearch(user, fhirServerBase, query);
  }

  @Get(':id')
  public get(@FhirServerBase() fhirServerBase, @Query() query, @User() user, @Param('id') id: string) {
    return super.baseGet(fhirServerBase, id, query, user);
  }

  @Post()
  public create(@FhirServerBase() fhirServerBase, @User() user, @Body() body) {
    return super.baseCreate(fhirServerBase, body, user);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @Param('id') id: string, @Body() body, @User() user) {
    return super.baseUpdate(fhirServerBase, id, body, user);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, id, user);
  }
}
