import {BaseFhirController} from './base-fhir.controller';
import {HttpService} from '@nestjs/axios';
import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import type {ITofRequest} from './models/tof-request';
import type {ExpandOptions} from '../../../../libs/tof-lib/src/lib/stu3/expandOptions';
import {ValueSet} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {FhirServerBase, FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {AxiosRequestConfig} from 'axios';
import { IOperationOutcome } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Controller('api/valueSet')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Value Set')
@ApiOAuth2([])
export class ValueSetController extends BaseFhirController {
  resourceType = 'ValueSet';

  protected readonly logger = new TofLogger(ValueSetController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  @Post(':id/expand')
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

  @Get()
  public search(@User() user, @FhirServerBase() fhirServerBase, @Query() query?: any, @RequestHeaders() headers?): Promise<any> {
    return super.baseSearch(user, fhirServerBase, query, headers);
  }

  @Get(':id')
  public get(@FhirServerBase() fhirServerBase, @Query() query, @User() user, @Param('id') id: string) {
    return super.baseGet(fhirServerBase, id, query, user);
  }

  @Post()
  public create(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = true) {
    return super.baseCreate(fhirServerBase, fhirServerVersion, body, user, contextImplementationGuideId, applyContextPermissions);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = false) {
    return super.baseUpdate(fhirServerBase, fhirServerVersion, id, body, user, contextImplementationGuideId, applyContextPermissions);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion: 'stu3'|'r4', @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, fhirServerVersion, id, user);
  }
}
