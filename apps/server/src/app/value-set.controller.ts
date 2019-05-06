import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {ExpandOptions} from '../../../../libs/tof-lib/src/lib/stu3/expandOptions';
import {ValueSet} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {IFhirConfig} from './models/fhir-config';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import * as config from 'config';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, User} from './server.decorators';
import {ConfigService} from './config.service';

const fhirConfig: IFhirConfig = config.get('fhir');

@Controller('valueSet')
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

      const getOptions = {
        url: buildUrl(request.fhirServerBase, 'ValueSet', id),
        method: 'GET'
      };

      this.logger.log(`Expand operation is requesting value set content for ${id}`);

      this.httpService.request<ValueSet>(getOptions).toPromise()
        .then((results) => {
          const valueSet = results.data;
          this.logger.log('Retrieved value set content for expand');

          const expandOptions = {
            url: buildUrl(fhirConfig.terminologyServer || request.fhirServerBase, 'ValueSet', null, '$expand', options),
            method: 'POST',
            data: valueSet
          };

          this.logger.log(`Asking the FHIR server to expand value set ${id}`);
          return this.httpService.request(expandOptions).toPromise();
        })
        .then((results) => {
          this.logger.log('FHIR server responded with expanded value set');
          return results.data;
        });
    });
  }

  @Get()
  public search(@User() user, @FhirServerBase() fhirServerBase, @Query() query?: any): Promise<any> {
    return super.baseSearch(user, fhirServerBase, query);
  }

  @Get(':id')
  public get(@FhirServerBase() fhirServerBase, @Query() query, @User() user, @Param('id') id: string) {
    return super.baseGet(fhirServerBase, id, query, user);
  }

  @Post()
  public create(@FhirServerBase() fhirServerBase, @User() user, @Body() body) {
    return super.baseCreate(fhirServerBase, body, user);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @Param('id') id: string, @Body() body, @User() user) {
    return super.baseUpdate(fhirServerBase, id, body, user);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, id, user);
  }
}
