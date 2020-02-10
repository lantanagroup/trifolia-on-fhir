import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, NotFoundException, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {buildUrl, generateId} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Bundle, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {AxiosRequestConfig} from 'axios';
import {ApiImplicitQuery, ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';
import {IPractitioner} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';

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

  private async subscribeCampaigner(email: string, firstName: string, lastName: string) {
    if (!this.configService.announcementService) return;
    if (this.configService.announcementService.type === 'campaigner' && !this.configService.announcementService.listId && !this.configService.announcementService.apiKey) return;

    let subscriber;

    try {
      const subscriberResponse = await this.httpService.get(`https://edapi.campaigner.com/v1/Subscribers/${email}/Properties?ApiKey=${this.configService.announcementService.apiKey}`).toPromise();
      subscriber = subscriberResponse.data;
    } catch (ex) {
      try {
        const subscriberResponse = await this.httpService.post(`https://edapi.campaigner.com/v1/Subscribers?ApiKey=${this.configService.announcementService.apiKey}`, {
          EmailAddress: email,
          Lists: [ this.configService.announcementService.listId ]
        }).toPromise();
        subscriber = subscriberResponse.data;
      } catch (ex) {
        this.logger.error(`Could not create subscriber ${email}: ${ex.message}`);
      }
    }

    try {
      if (!subscriber.CustomFields) {
        subscriber.CustomFields = [];
      }

      if (firstName) {
        const foundFirstName = subscriber.CustomFields.find(cf => cf.FieldName === 'FirstName');

        if (foundFirstName) {
          foundFirstName.Value = firstName;
        } else {
          subscriber.CustomFields.push({
            FieldName: 'FirstName',
            Value: firstName
          });
        }
      }

      if (lastName) {
        const foundLastName = subscriber.CustomFields.find(cf => cf.FieldName === 'LastName');

        if (foundLastName) {
          foundLastName.Value = lastName;
        } else {
          subscriber.CustomFields.push({
            FieldName: 'LastName',
            Value: lastName
          });
        }
      }

      const updateSubscriber = {
        EmailAddress: email,
        CustomFields: subscriber.CustomFields,
        Lists: (subscriber.Lists || []).map(l => l.ListID)
      };

      if (updateSubscriber.Lists.indexOf(this.configService.announcementService.listId) < 0) {
        updateSubscriber.Lists.push(this.configService.announcementService.listId);
      }

      await this.httpService.put(`https://edapi.campaigner.com/v1/Subscribers/${email}?ApiKey=${this.configService.announcementService.apiKey}`, updateSubscriber).toPromise();
    } catch (ex) {
      this.logger.error(`Could not update campaigner subscriber ${email}: ${ex.message}`)
    }
  }

  private async unsubscribeCampaigner(email: string) {
    try {
      await this.httpService.post(`https://edapi.campaigner.com/v1/Lists/${this.configService.announcementService.listId}/RemoveEmails?ApiKey=${this.configService.announcementService.apiKey}`, {
        EmailAddresses: [email]
      }).toPromise();
    } catch (ex) {
      this.logger.error(`Could not unsubscribe ${email} from list: ${ex.message}`);
    }
  }

  private async toggleAnnouncements(subscribed: boolean, email: string, firstName: string, lastName: string) {
    if (!this.configService.announcementService) return;

    if (this.configService.announcementService.type === 'campaigner') {
      if (subscribed) {
        await this.subscribeCampaigner(email, firstName, lastName);
      } else {
        await this.unsubscribeCampaigner(email);
      }
    }
  }

  @Post('me')
  public async updateMyPractitioner(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Body() practitioner: Practitioner): Promise<any> {
    const existingPractitioner = await this.getMyPractitioner(user, fhirServerBase, true);
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
      practitioner.id = generateId();
    }

    const practitionerRequest: AxiosRequestConfig = {
      url: buildUrl(fhirServerBase, this.resourceType, practitioner.id),
      method: 'PUT',
      data: practitioner
    };

    const results = await this.httpService.request(practitionerRequest).toPromise();
    const location = results.headers.location || results.headers['content-location'];

    if (!location) {
      throw new Error(`FHIR server did not respond with a location to the newly created ${this.resourceType}`);
    }

    const updatedPractitionerResponse = await this.httpService.get<IPractitioner>(location).toPromise();
    const updatedPractitioner = updatedPractitionerResponse.data;

    const subscribeExt = (updatedPractitioner.extension || []).find(e => e.url === Globals.extensionUrls['extension-practitioner-announcements']);
    const emailTelecom = (updatedPractitioner.telecom || []).find(t => t.system === 'email');
    let email = emailTelecom ? emailTelecom.value : undefined;
    const firstName = updatedPractitioner.name && updatedPractitioner.name.length > 0 && updatedPractitioner.name[0].given && updatedPractitioner.name[0].given.length > 0 ?
      updatedPractitioner.name[0].given[0] : undefined;
    const lastName = updatedPractitioner.name && updatedPractitioner.name.length > 0 ? updatedPractitioner.name[0].family : undefined;

    if (email && email.startsWith('mailto:')) {
      email = email.substring('mailto:'.length);
    }

    if (subscribeExt && email) {
      this.toggleAnnouncements(subscribeExt.valueBoolean, email, firstName, lastName);
    }

    return updatedPractitioner;
  }

  @Get('me')
  public getMe(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Query('resolveIfNotFound') resolveIfNotFound = false): Promise<Practitioner> {
    return super.getMyPractitioner(user, fhirServerBase, resolveIfNotFound);
  }

  @Get('user')
  public async getUsers(@FhirServerBase() fhirServerBase: string, @Query() query) {
    if (query.name) {
      query['name:contains'] = query.name;
      delete query.name;
    }

    const url = buildUrl(fhirServerBase, 'Practitioner', null, null, query);
    const results = await this.httpService.get<Bundle>(url).toPromise();
    return results.data;
  }

  @Get()
  @ApiImplicitQuery({ name: 'name', type: 'string', required: false, description: 'Filter results by name' })
  public search(@User() user, @FhirServerBase() fhirServerBase, @Query() query?: any, @RequestHeaders() headers?): Promise<any> {
    return super.baseSearch(user, fhirServerBase, query, headers);
  }

  @Get(':id')
  public get(@FhirServerBase() fhirServerBase, @Query() query, @User() user, @Param('id') id: string) {
    return super.baseGet(fhirServerBase, id, query, user);
  }

  @Post()
  public create(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @User() user, @Body() body) {
    return super.baseCreate(fhirServerBase, fhirServerVersion, body, user);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user) {
    return super.baseUpdate(fhirServerBase, fhirServerVersion, id, body, user);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion: 'stu3'|'r4', @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, fhirServerVersion, id, user);
  }
}
