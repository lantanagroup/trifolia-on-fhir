import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {ValueSet} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {ConformanceController} from './conformance/conformance.controller';
import {AuthService} from './auth/auth.service';
import {ConformanceService} from './conformance/conformance.service';
import {Paginated} from '@trifolia-fhir/tof-lib';
import {IConformance} from '@trifolia-fhir/models';

@Controller('api/valueSet')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Value Set')
@ApiOAuth2([])
export class ValueSetController extends ConformanceController {
  resourceType = 'ValueSet';

  protected readonly logger = new TofLogger(ValueSetController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: ConformanceService, protected configService: ConfigService) {
    super(conformanceService);
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
  public async searchValueSet(@User() user, @Request() req?: any): Promise<Paginated<IConformance>> {
    return super.searchConformance(user, req);
  }

  @Get(':id')
  public async getValueSet(@User() user, @Param('id') id: string): Promise<IConformance> {
    return super.getById(user, id);
  }

  @Post()
  public async createValueSet(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IConformance = body;
    return this.conformanceService.createConformance(conformance, implementationGuideId);
  }

  @Put(':id')
  public async updateValueSet(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId ) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IConformance = body;
    return this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public async deleteValueSet(@User() user, @Param('id') id: string) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }
}
