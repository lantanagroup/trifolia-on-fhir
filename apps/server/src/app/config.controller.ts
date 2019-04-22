import {Controller, Get, HttpService, Req} from '@nestjs/common';
import {BaseController} from './base.controller';
import {CapabilityStatement} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ITofRequest} from './models/tof-request';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {IServerConfig} from './models/server-config';
import {IFhirConfig} from './models/fhir-config';
import {IAuthConfig} from './models/auth-config';
import {IGithubConfig} from './models/github-config';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import {ConfigModel} from '../../../../libs/tof-lib/src/lib/config-model';
import * as config from 'config';
import * as modulePackage from '../../../../package.json';
import {ApiUseTags} from '@nestjs/swagger';

const serverConfig: IServerConfig = config.get('server');
const fhirConfig: IFhirConfig = config.get('fhir');
const authConfig: IAuthConfig = config.get('auth');
const githubConfig: IGithubConfig = config.get('github');

@Controller('config')
@ApiUseTags('Config')
export class ConfigController extends BaseController {
  private static serverMetadata = {};
  
  constructor(private httpService: HttpService) {
    super();
  }

  @Get()
  public getConfig() {
    if (!fhirConfig.servers) {
      throw new InvalidModuleConfigException('FHIR servers have not been configured on this server');
    }

    const retConfig: ConfigModel = {
      version: modulePackage.version,
      supportUrl: serverConfig.supportUrl,
      fhirServers: fhirConfig.servers.map((server) => ({ id: server.id, name: server.name, short: server.short })),
      auth: {
        clientId: authConfig.clientId,
        scope: authConfig.scope,
        domain: authConfig.domain
      },
      github: {
        clientId: githubConfig.clientId
      },
      nonEditableResources: fhirConfig.nonEditableResources
    };

    return retConfig;
  }

  @Get('fhir')
  public getFhirCapabilities(@Req() request: ITofRequest): Promise<CapabilityStatement> {
    if (ConfigController.serverMetadata[request.fhirServerBase]) {
      return Promise.resolve(ConfigController.serverMetadata[request.fhirServerBase]);
    }

    const options = {
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
