import {BaseController} from './base.controller';
import {Body, Controller, Get, Header, HttpService, Param, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Bundle, DomainResource} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ITofRequest} from './models/tof-request';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {AxiosRequestConfig} from 'axios';
import {map} from 'rxjs/operators';

@Controller('import')
@UseGuards(AuthGuard('bearer'))
export class ImportController extends BaseController {
  readonly vsacBaseUrl = 'https://cts.nlm.nih.gov/fhir/';

  constructor(private httpService: HttpService) {
    super();
  }

  @Get('vsac/:resourceType/:id')
  public async importVsacValueSet(@Req() request: ITofRequest, @Param('resourceType') resourceType: string, @Param('id') id: string) {
    const vsacAuthorization = request.headers['vsacauthorization'];

    if (!vsacAuthorization) {
      throw new UnauthorizedException('Expected vsacauthorization header to be provided');
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
    return await this.importResource(request, results.data);
  }

  @Post()
  public async importResource(@Req() request: ITofRequest, @Body() resource: DomainResource) {
    const resourceType = resource.resourceType;

    const bundle = <Bundle> resource;
    const options: AxiosRequestConfig = {
      data: resource
    };

    if (resource.resourceType === 'Bundle' && bundle.type === 'transaction') {
      options.method = 'POST';
      options.url = request.fhirServerBase + (request.fhirServerBase.endsWith('/') ? '' : '/');
    } else {
      options.method = resource.id ? 'PUT' : 'POST';
      options.url = buildUrl(request.fhirServerBase, resourceType, resource.id);
    }

    return await this.httpService.request(options)
      .pipe(map(results => results.data))
      .toPromise();
  }
}
