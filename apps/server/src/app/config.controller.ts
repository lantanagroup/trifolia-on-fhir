import {HttpService} from '@nestjs/axios';
import {Controller, Get, Req} from '@nestjs/common';
import {BaseController} from './base.controller';
import {CapabilityStatement} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import type {ITofRequest} from './models/tof-request';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {ConfigModel} from '../../../../libs/tof-lib/src/lib/config-model';
import {ApiTags} from '@nestjs/swagger';
import {ConfigService} from './config.service';
import {AxiosRequestConfig} from 'axios';
import * as modulePackage from '../../../../package.json';

@Controller('api/config')
@ApiTags('Config')
export class ConfigController extends BaseController {
  private static serverMetadata = {};

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }

  @Get()
  public getConfig() {
    if (!this.configService.fhir.servers) {
      throw new Error('FHIR servers have not been configured on this server');
    }

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

  @Get('fhir')
  public getFhirCapabilities(@Req() request: ITofRequest): Promise<CapabilityStatement> {
    if (ConfigController.serverMetadata[request.fhirServerBase]) {
      return Promise.resolve(ConfigController.serverMetadata[request.fhirServerBase]);
    }

    const options: AxiosRequestConfig = {
      url: buildUrl(request.fhirServerBase, 'metadata'),
      method: 'GET'
    };

    return this.httpService.request(options).toPromise()
      .then((results) => {
        ConfigController.serverMetadata[request.fhirServerBase] = results.data;
        return results.data;
      });
  }
}
