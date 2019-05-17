import {BaseController} from './base.controller';
import {BadRequestException, Controller, Get, Headers, HttpService, Param, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ITofUser} from './models/tof-request';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {ConfigService} from './config.service';
import {TofLogger} from './tof-logger';
import {FhirController} from './fhir.controller';
import {FhirServerBase, User} from './server.decorators';

@Controller('import')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Import')
@ApiOAuth2Auth()
export class ImportController extends BaseController {
  readonly vsacBaseUrl = 'https://cts.nlm.nih.gov/fhir/';
  readonly logger = new TofLogger(ImportController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }

  @Get('vsac/:resourceType/:id')
  public async importVsacValueSet(@FhirServerBase() fhirServerBase: string, @User() user: ITofUser, @Headers('vsacauthorization') vsacAuthorization: string, @Param('resourceType') resourceType: string, @Param('id') id: string) {
    if (!vsacAuthorization) {
      throw new BadRequestException('Expected vsacauthorization header to be provided');
    }

    const options = {
      method: 'GET',
      url: `${this.vsacBaseUrl}${resourceType}/${id}`,
      headers: {
        'Authorization': vsacAuthorization,
        'Accept': 'application/json'
      }
    };

    const results = await this.httpService.request(options).toPromise();

    if (!results.data || ['ValueSet','CodeSystem'].indexOf(results.data.resourceType) < 0) {
      throw new BadRequestException('Expected VSAC to return a ValueSet or CodeSystem');
    }

    const proxyUrl = `/${results.data.resourceType}/${results.data.id}`;
    const fhirProxy = new FhirController(this.httpService, this.configService);
    const proxyResults = await fhirProxy.proxy(proxyUrl, null, 'PUT', fhirServerBase, user, results.data);
    return proxyResults.data;
  }
}
