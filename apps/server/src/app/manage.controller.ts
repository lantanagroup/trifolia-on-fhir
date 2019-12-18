import {BaseController} from './base.controller';
import {
  Body,
  Controller,
  Get,
  HttpService,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {ISocketConnection} from './models/socket-connection';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {ConfigService} from './config.service';
import {FhirServerBase, User} from './server.decorators';
import {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Bundle, Practitioner} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {UserModel} from '../../../../libs/tof-lib/src/lib/user-model';

interface MessageRequest {
  message: string;
}

@Controller('api/manage')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Manage')
@ApiOAuth2Auth()
export class ManageController extends BaseController {

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }

  @Get('user')
  async getUsers(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Query('count') count = 10, @Query('page') page = 1): Promise<{ total: number, users: UserModel[] }> {
    this.assertAdmin(user);

    const params = {
      _count: count,
      _getpagesoffset: (page - 1) * count,
      _summary: true
    };

    const url = buildUrl(fhirServerBase, 'Practitioner', null, null, params);
    const results = await this.httpService.get(url).toPromise();
    const bundle = <Bundle> results.data;

    return {
      total: bundle.total,
      users: (bundle.entry || []).map(entry => {
        const practitioner = <Practitioner> entry.resource;

        return <UserModel> {
          id: practitioner.id,
          identifier: practitioner.identifier,
          name: practitioner.name
        };
      })
    };
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
}
