import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Headers, Get, Param, Post, Put, Request, UseGuards, UnauthorizedException, BadRequestException} from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import {ValueSet} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {FhirResourcesController} from './fhir-resources/fhir-resources.controller';
import {AuthService} from './auth/auth.service';
import {FhirResourcesService} from './fhir-resources/fhir-resources.service';
import {Paginated} from '@trifolia-fhir/tof-lib';
import {IFhirResource} from '@trifolia-fhir/models';
import { firstValueFrom } from 'rxjs';
import { TofNotFoundException } from '../not-found-exception';
import { BundleEntry } from '@trifolia-fhir/r5';

@Controller('api/valueSets')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Value Set')
@ApiOAuth2([])
export class ValueSetController extends FhirResourcesController {
  resourceType = 'ValueSet';

  protected readonly logger = new TofLogger(ValueSetController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected fhirResourceService: FhirResourcesService, protected configService: ConfigService) {
    super(fhirResourceService);
  }

  /*@Post(':id/expand')
  public async getExpanded(@Req() request: ITofRequest, @Param('id') id: string, @Body() options?: ExpandOptions) {
    this.logger.log(`Beginning request to expand value set ${id}`);

    try {
      const getOptions: AxiosRequestConfig = {
        url: buildUrl(request.fhirServerBase, 'ValueSet', id),
        method: 'GET'
      };

      this.logger.log(`Expand operation is requesting value set content for ${id}`);

      const vsResults = await this.httpService.request<ValueSet>(getOptions).toPromise();

      const valueSet = vsResults.data;
      this.logger.log('Retrieved value set content for expand');

      const expandOptions: AxiosRequestConfig = {
        url: buildUrl(this.configService.fhir.terminologyServer || request.fhirServerBase, 'ValueSet', null, '$expand', options),
        method: 'POST',
        data: valueSet
      };

      this.logger.log(`Asking the FHIR server to expand value set ${id}`);
      const expandedResults = await this.httpService.request(expandOptions).toPromise();

      this.logger.log('FHIR server responded with expanded value set');
      return expandedResults.data;
    } catch (ex) {
      if (ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome') {
        const oo = ex.response.data as IOperationOutcome;
        throw new InternalServerErrorException(oo);
      }

      this.logger.error(`Failed to expand value set: ${ex.message}`);
      throw new InternalServerErrorException();
    }
  }
*/
  @Get()
  public async searchValueSet(@User() user, @Request() req?: any): Promise<Paginated<IFhirResource>> {
    return super.searchFhirResource(user, req);
  }

  @Get('vsac')
  public async searchVSAC(
    @User() user, 
    @Headers('vsacauthorization') vsacAuthorization: string,
    @Request() req?: any
  ): Promise<Paginated<ValueSet>> {
    const vsacBaseUrl = 'https://cts.nlm.nih.gov/fhir/ValueSet';

    let url = '';
    let count = 'count' in req.query ? req.query['count'] : 5;
    let offset = 'page' in req.query ? (req.query['page']-1) * count : 0;

    if ('id' in req.query) {
      url = `${vsacBaseUrl}/${req.query['id']}`;
    } else if ('name' in req.query) {
      let queryString = `_total=accurate&_count=${count}&_offset=${offset}&_sort=name&name=${encodeURIComponent(req.query['name'])}`;
      url = `${vsacBaseUrl}?${queryString}`;
    } else {
      throw new Error('Invalid search request. ID or name parameters required.');
    }

    const options: AxiosRequestConfig = {
      method: 'GET',
      url: url,
      headers: {
        'Authorization': vsacAuthorization,
        'Accept': 'application/json'
      }
    };

    let vsacResults;
    
    try {
      vsacResults = await firstValueFrom(this.httpService.request(options)); 
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        throw new TofNotFoundException(`The value set ${req.query['id']} was not found in VSAC`);
      } else if (ex.response && ex.response.status === 401) {
        throw new UnauthorizedException(`The API key provided was not accepted by VSAC`);
      }

      this.logger.error(`An error occurred while querying VSAC: ${ex.message}`, ex.stack);
      throw ex;
    }

    let results: ValueSet[] = [];
    let total = 0;

    if (vsacResults.data.resourceType === 'ValueSet') {
      results.push(vsacResults.data);
      total = 1;
    } else if (vsacResults.data.resourceType === 'Bundle') {
      results = (vsacResults.data.entry || []).map((e: BundleEntry) => e.resource);
      total = vsacResults.data.total;
    } else {
      throw new BadRequestException('Expected VSAC to return a ValueSet or Bundle');
    }


    const result: Paginated<ValueSet> = {
      itemsPerPage: count,
      results: results,
      total: total
    };

    return result;
  }

  @Get(':id')
  public async getValueSet(@User() user, @Param('id') id: string): Promise<IFhirResource> {
    return super.getById(user, id);
  }

  @Post()
  public async createValueSet(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let fhirResource: IFhirResource = body;
    return this.fhirResourceService.createFhirResource(fhirResource, implementationGuideId);
  }

  @Put(':id')
  public async updateValueSet(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId ) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let fhirResource: IFhirResource = body;
    return this.fhirResourceService.updateFhirResource(id, fhirResource, implementationGuideId );
  }

  @Delete(':id')
  public async deleteValueSet(@User() user, @Param('id') id: string) {
    await this.assertCanWriteById(user, id);
    return this.fhirResourceService.deleteFhirResource(id);
  }
}
