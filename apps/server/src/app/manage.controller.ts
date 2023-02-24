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
import { UsersService } from './users/users.service';
import { IUser } from '@trifolia-fhir/models';

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
