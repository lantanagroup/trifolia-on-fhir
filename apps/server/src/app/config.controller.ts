import {HttpService} from '@nestjs/axios';
import {Controller, Get} from '@nestjs/common';
import {BaseController} from './base.controller';
import {ConfigModel} from '../../../../libs/tof-lib/src/lib/config-model';
import {ApiTags} from '@nestjs/swagger';
import {ConfigService} from './config.service';
import modulePackage from '../../../../package.json';

@Controller('api/config')
@ApiTags('Config')
export class ConfigController extends BaseController {
  private static serverMetadata = {};

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }

  @Get()
  public getConfig() {
   /* if (!this.configService.fhir.servers) {
      throw new Error('FHIR servers have not been configured on this server');
    }*/

    const retConfig: ConfigModel = {
      version: modulePackage.version,
      supportUrl: this.configService.server.supportUrl,
      fhirServers: this.configService.fhir.servers.map((server) => ({ id: server.id, name: server.name, short: server.short })),
      enableSecurity: this.configService.server.enableSecurity,
      bannerMessage: this.configService.server.bannerMessage,
      auth: {
        clientId: this.configService.auth.clientId,
        scope: this.configService.auth.scope,
        issuer: this.configService.auth.issuer,
        logoutUrl: this.configService.auth.logoutUrl
      },
      github: !this.configService.github ? null : {
        clientId: this.configService.github.clientId,
        authBase: this.configService.github.authBase,
        apiBase: this.configService.github.apiBase
      },
      nonEditableResources: this.configService.fhir.nonEditableResources,
      announcementService: !!this.configService.announcementService && !!this.configService.announcementService.type,
      termsOfUse: this.configService.termsOfUse,
      privacyPolicy: this.configService.privacyPolicy
    };

    return retConfig;
  }

}
