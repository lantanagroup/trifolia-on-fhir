import {BaseController} from './base.controller';
import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpService,
  Param,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {ConfigService} from './config.service';
import {TofLogger} from './tof-logger';
import {FhirController} from './fhir.controller';
import {FhirServerBase, FhirServerVersion, User} from './server.decorators';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {TofNotFoundException} from '../not-found-exception';
import {AxiosRequestConfig} from 'axios';
import {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';

@Controller('api/import')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Import')
@ApiOAuth2Auth()
export class ImportController extends BaseController {
  readonly vsacBaseUrl = 'https://cts.nlm.nih.gov/fhir/';
  readonly logger = new TofLogger(ImportController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }

  @Get('vsac/:id')
  public async importVsacValueSet(
    @FhirServerBase() fhirServerBase: string,
    @FhirServerVersion() fhirServerVersion,
    @User() user: ITofUser,
    @Headers('vsacauthorization') vsacAuthorization: string,
    @Param('id') id: string,
    @Param('applyContextPermissions') applyContextPermissions = true) {

    if (!vsacAuthorization) {
      throw new BadRequestException('Expected vsacauthorization header to be provided');
    }

    const options: AxiosRequestConfig = {
      method: 'GET',
      url: buildUrl(this.vsacBaseUrl, 'ValueSet', id),
      headers: {
        'Authorization': vsacAuthorization,
        'Accept': 'application/json'
      }
    };

    let vsacResults;

    try {
      vsacResults = await this.httpService.request(options).toPromise();
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        throw new TofNotFoundException(`The value set ${id} was not found in VSAC`);
      } else if (ex.response && ex.response.status === 401) {
        throw new UnauthorizedException(`The username/password provided were not accepted by VSAC`);
      }

      this.logger.error(`An error occurred while retrieving value set ${id} from VSAC: ${ex.message}`, ex.stack);
      throw ex;
    }

    if (!vsacResults.data || ['ValueSet','CodeSystem'].indexOf(vsacResults.data.resourceType) < 0) {
      throw new BadRequestException('Expected VSAC to return a ValueSet or CodeSystem');
    }

    try {
      const proxyUrl = `/${vsacResults.data.resourceType}/${vsacResults.data.id}`;
      const fhirProxy = new FhirController(this.httpService, this.configService);
      const proxyResults = await fhirProxy.proxy(proxyUrl, null, 'PUT', fhirServerBase, fhirServerVersion, user, vsacResults.data, applyContextPermissions);
      return proxyResults.data;
    } catch (ex) {
      this.logger.error(`An error occurred while importing value set ${id} from VSAC: ${ex.message}`, ex.stack);
      throw ex;
    }
  }
}
