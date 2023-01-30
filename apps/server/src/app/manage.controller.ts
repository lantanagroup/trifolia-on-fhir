import {BaseController} from './base.controller';
import {HttpService} from '@nestjs/axios';
import {Body, Controller, Get, Header, Param, ParseIntPipe, Post, Query, Req, UseGuards} from '@nestjs/common';
import type {ITofRequest} from './models/tof-request';
import {ISocketConnection} from './models/socket-connection';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {ConfigService} from './config.service';
import {FhirServerBase, User} from './server.decorators';
import type {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Bundle, ContactPoint as R4ContactPoint, Practitioner as R4Practitioner} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {ContactPoint as STU3ContactPoint, Practitioner as STU3Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {UserModel} from '../../../../libs/tof-lib/src/lib/user-model';
import {getDisplayIdentifier, getDisplayName} from '../../../../libs/tof-lib/src/lib/helper';
import {ExportService} from './export.service';
import {QueueInfo} from '../../../../libs/tof-lib/src/lib/queue-info';
import {IAuditEvent, IBundle, IPractitioner} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {TofLogger} from './tof-logger';

interface MessageRequest {
  message: string;
}

@Controller('api/manage')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Manage')
@ApiOAuth2([])
export class ManageController extends BaseController {
  protected readonly logger = new TofLogger(ManageController.name);

  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    private exportService: ExportService) {
    super(configService, httpService);
  }

  @Get('user/download')
  @Header('Content-Type', 'text/plain')
  @Header('Content-Disposition', 'attachment; filename="users.csv"')
  async downloadUsers(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string) {
    this.assertAdmin(user);

    let practitioners: (STU3Practitioner | R4Practitioner)[] = [];

    const getNext = async (url: string) => {
      const bundle = await this.httpService.get<Bundle>(url).toPromise();
      practitioners = practitioners.concat((bundle.data.entry || []).map(entry => <STU3Practitioner | R4Practitioner> entry.resource));
      const nextLink = (bundle.data.link || []).find(link => link.relation === 'next');

      if (nextLink) {
        await getNext(nextLink.url);
      }
    };

    const initialUrl = buildUrl(fhirServerBase, 'Practitioner', null, null, { _count: 50 });
    await getNext(initialUrl);

    let response = 'Identifier, Name, Email\n';

    practitioners
      .filter(practitioner => practitioner.name && practitioner.name.length > 0)
      .forEach(practitioner => {
        const cells = [ getDisplayIdentifier(practitioner.identifier, true).replace(/,/g, ' '), getDisplayName(practitioner.name).replace(/, /g, ' ') ];

        const emailTelecoms: (STU3ContactPoint | R4ContactPoint)[] = (practitioner.telecom || []);
        const emailTelecom = emailTelecoms.find(telecom => telecom.system === 'email');

        cells.push(emailTelecom && emailTelecom.value ? emailTelecom.value.replace('mailto:', '') : '');

        response += `${cells.join('\t')}\n`;
      });

    return response;
  }

  private async getAllAudits(url: string) {
    const response = await this.httpService.get<IBundle>(url).toPromise();
    const bundle = response.data;
    const nextUrl = (bundle.link || []).find(l => l.relation === 'next');

    if (nextUrl && nextUrl.url) {
      const nextBundle = await this.getAllAudits(nextUrl.url);
      bundle.entry = bundle.entry.concat(nextBundle.entry);
      bundle.total = bundle.entry.length;
    }

    return bundle;
  }

  private async changeAuditAgent(fhirServerBase: string, auditsBundle: IBundle, newAgent: IPractitioner) {
    if (!auditsBundle || !auditsBundle.entry || auditsBundle.entry.length === 0) return;

    const transactionBundle = {
      resourceType: 'Bundle',
      type: 'transaction',
      entry: auditsBundle.entry.map(e => {
        const auditEvent = <any> e.resource;

        if (auditEvent.agent[0].who) {
          auditEvent.agent[0] = {
            who: {
              reference: `Practitioner/${newAgent.id}`
            }
          };
        } else if (auditEvent.agent[0].reference) {
          auditEvent.agent[0] = {
            reference: {
              reference: `Practitioner/${newAgent.id}`
            }
          };
        }

        return {
          request: {
            method: 'PUT',
            url: `AuditEvent/${e.resource.id}`,
          },
          resource: auditEvent
        };
      })
    };

    const transactionResults = await this.httpService.post<IBundle>(fhirServerBase, transactionBundle).toPromise();
    const responseBundle = transactionResults.data;
    const foundError = (responseBundle.entry || []).find(e => e.response && e.response.status && !e.response.status.startsWith('200'));

    if (foundError) {
      throw new Error('Not all audit events successfully updated');
    }
  }

  @Post('user/:sourceUserId/([\$])merge/:targetUserId')
  async mergeUser(@Param('sourceUserId') sourceUserId: string, @Param('targetUserId') targetUserId: string, @FhirServerBase() fhirServerBase: string, @User() user: ITofUser) {
    this.assertAdmin(user);

    const sourceUserResponse = await this.httpService.get<IPractitioner>(buildUrl(fhirServerBase, 'Practitioner', sourceUserId)).toPromise();
    const targetUserResponse = await this.httpService.get<IPractitioner>(buildUrl(fhirServerBase, 'Practitioner', targetUserId)).toPromise();
    const targetUser = targetUserResponse.data;

    const allAudits = await this.getAllAudits(buildUrl(fhirServerBase, 'AuditEvent', null, null, {
      _count: 100,
      agent: `Practitioner/${sourceUserId}`
    }));

    await this.changeAuditAgent(fhirServerBase, allAudits, targetUser);
    const deleteResults = await this.httpService.delete(buildUrl(fhirServerBase, 'Practitioner', sourceUserId)).toPromise();

    this.logger.log(`Successfully merged user ${sourceUserId} into ${targetUserId}`);
  }

  @Get('user')
  async getUsers(
    @User() user: ITofUser,
    @FhirServerBase() fhirServerBase: string,
    @Query('name') searchName,
    @Query('count', ParseIntPipe) count = 10,
    @Query('page') page = 1): Promise<{ total: number, hasMore: boolean, users: UserModel[] }> {
    this.assertAdmin(user);

    const params = {
      _count: count,
      _getpagesoffset: (page - 1) * count,
      _summary: true,
      name: undefined
    };

    if (searchName) {
      params.name = searchName;
    }

    const url = buildUrl(fhirServerBase, 'Practitioner', null, null, params);
    const results = await this.httpService.get(url).toPromise();
    const bundle = <Bundle> results.data;
    const nextUrl = (bundle.link || []).find(l => l.relation === 'next');

    const res = {
      total: bundle.total,
      hasMore: !!nextUrl,
      users: (bundle.entry || []).map(entry => {
        const practitioner = <STU3Practitioner | R4Practitioner> entry.resource;

        return <UserModel> {
          id: practitioner.id,
          identifier: practitioner.identifier,
          name: practitioner.name
        };
      })
    };

    return res;
  }

  @Get('user/active')
  getActiveUsers(@Req() request: ITofRequest, @User() user: ITofUser) {
    this.assertAdmin(user);

    const connections = request.ioConnections.map((connection: ISocketConnection) => {
      let name;

      if (connection.practitioner && connection.practitioner.name && connection.practitioner.name.length > 0) {
        name = connection.practitioner.name[0].family;

        if (connection.practitioner.name[0].given && connection.practitioner.name[0].given.length > 0) {
          if (name) {
            name += ', ';
          }

          name += connection.practitioner.name[0].given.join(' ');
        }
      }

      return {
        socketId: connection.id,
        userId: connection.userProfile ? connection.userProfile.sub : null,
        email: connection.userProfile ? connection.userProfile.email : null,
        practitionerReference: connection.practitioner ? `Practitioner/${connection.practitioner.id}` : null,
        name: name
      };
    });

    return connections;
  }

  @Post('user/active/message')
  sendMessageToActiveUsers(@Req() req: ITofRequest, @Body() body: MessageRequest, @User() user: ITofUser) {
    this.assertAdmin(user);

    req.io.emit('message', body.message);
  }

  @Get('queue')
  getPublishingQueue(@User() user: ITofUser) {
    this.assertAdmin(user);

    return this.exportService.exports.map(e => {
      return <QueueInfo> {
        packageId: e.packageId,
        active: !!e.publishing,
        userId: e.user.sub,
        userName: e.user.name,
        implementationGuideId: e.implementationGuide.id,
        queuedAt: e.queuedAt,
        publishStartedAt: e.publishStartedAt
      };
    });
  }

  @Post('queue/:packageId/cancel')
  cancelPublishingQueue(@Param('packageId') packageId: string, @User() user: ITofUser) {
    this.assertAdmin(user);

    this.exportService.cancel(packageId);
  }
}
