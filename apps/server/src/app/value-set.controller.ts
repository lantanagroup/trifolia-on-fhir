import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {ExpandOptions} from '../../../../libs/tof-lib/src/lib/stu3/expandOptions';
import {ValueSet} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {AxiosRequestConfig} from 'axios';

@Controller('api/valueSet')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Value Set')
@ApiOAuth2Auth()
export class ValueSetController extends BaseFhirController {
  resourceType = 'ValueSet';

  protected readonly logger = new TofLogger(ValueSetController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  @Get(':id/expand')
  public getExpanded(@Req() request: ITofRequest, @Param('id') id: string, @Body() options?: ExpandOptions) {
    return new Promise((resolve, reject) => {
      this.logger.log(`Beginning request to expand value set ${id}`);

      const getOptions: AxiosRequestConfig = {
        url: buildUrl(request.fhirServerBase, 'ValueSet', id),
        method: 'GET'
      };

      this.logger.log(`Expand operation is requesting value set content for ${id}`);

      this.httpService.request<ValueSet>(getOptions).toPromise()
        .then((results) => {
          const valueSet = results.data;
          this.logger.log('Retrieved value set content for expand');

          const expandOptions: AxiosRequestConfig = {
            url: buildUrl(this.configService.fhir.terminologyServer || request.fhirServerBase, 'ValueSet', null, '$expand', options),
            method: 'POST',
            data: valueSet
          };

          this.logger.log(`Asking the FHIR server to expand value set ${id}`);
          return this.httpService.request(expandOptions).toPromise();
        })
        .then((results) => {
          this.logger.log('FHIR server responded with expanded value set');
          resolve(results.data);
          return results.data;
        })
        .catch((err) => reject(err));
    });
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
  public create(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId) {
    return super.baseCreate(fhirServerBase, fhirServerVersion, body, user, contextImplementationGuideId);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user, @RequestHeaders('implementationGuideId') contextImplementationGuideId) {
    return super.baseUpdate(fhirServerBase, fhirServerVersion, id, body, user, contextImplementationGuideId);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, id, user);
  }
}
