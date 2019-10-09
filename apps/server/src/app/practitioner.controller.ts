import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ITofUser} from './models/tof-request';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Bundle, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {AxiosRequestConfig} from 'axios';
import {ApiImplicitQuery, ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, User} from './server.decorators';
import {ConfigService} from './config.service';
import nanoid from 'nanoid';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';

@Controller('api/practitioner')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Practitioner')
@ApiOAuth2Auth()
export class PractitionerController extends BaseFhirController {
  resourceType = 'Practitioner';

  protected readonly logger = new TofLogger(PractitionerController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  @Post('me')
  public updateMyPractitioner(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Body() practitioner: Practitioner): Promise<any> {
    return this.getMyPractitioner(user, fhirServerBase, true)
      .then((existingPractitioner) => {
        const authUser = user.sub;
        let system = Globals.defaultAuthNamespace;
        let value = authUser;

        if (authUser.startsWith('auth0|')) {
          system =  Globals.authNamespace;
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
  public getMe(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Query('resolveIfNotFound') resolveIfNotFound = false): Promise<Practitioner> {
    return super.getMyPractitioner(user, fhirServerBase, resolveIfNotFound);
  }

  @Get('user')
  public async getUsers(@FhirServerBase() fhirServerBase: string, @Query() query) {
    query.identifier = `${Globals.authNamespace}|`;

    const url = buildUrl(fhirServerBase, 'Practitioner', null, null, query);
    const results = await this.httpService.get<Bundle>(url).toPromise();
    return results.data;
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
