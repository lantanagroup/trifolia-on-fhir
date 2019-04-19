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

const fhirConfig: IFhirConfig = config.get('fhir');

@Controller('valueSet')
@UseGuards(AuthGuard('bearer'))
export class ValueSetController extends BaseFhirController {
  resourceType = 'ValueSet';
  
  protected readonly logger = new TofLogger(ValueSetController.name);
  
  constructor(protected httpService: HttpService) {
    super(httpService);
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
  public search(@Req() request: ITofRequest, @Query() query?: any): Promise<any> {
    return super.baseSearch(request.fhirServerBase, query);
  }

  @Get(':id')
  public get(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseGet(request.fhirServerBase, id, request.query);
  }

  @Post()
  public create(@Req() request: ITofRequest, @Body() body) {
    return super.baseCreate(request.fhirServerBase, body, request.query);
  }

  @Put(':id')
  public update(@Req() request: ITofRequest, @Param('id') id: string, @Body() body) {
    return super.baseUpdate(request.fhirServerBase, id, body, request.query);
  }

  @Delete(':id')
  public delete(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseDelete(request.fhirServerBase, id, request.query);
  }
}
