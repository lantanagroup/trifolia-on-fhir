import {InjectConnection} from '@nestjs/mongoose';
import {ApiTags, ApiOAuth2, ApiOperation} from '@nestjs/swagger';
import {Connection} from 'mongoose';
import {BaseDataController} from '../base/base-data.controller';
import {ConformanceService} from './conformance.service';
import {AuthGuard} from '@nestjs/passport';
import {Body, Controller, Delete, Get, Param, Put, UnauthorizedException, UseGuards} from '@nestjs/common';
import {ConformanceDocument} from './conformance.schema';
import {IImplementationGuide} from '@trifolia-fhir/tof-lib';
import {ImplementationGuide} from '@trifolia-fhir/r4';


@Controller('api/conformance')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Conformance')
@ApiOAuth2([])
export class ConformanceController extends BaseDataController<ConformanceDocument> {

  constructor(private readonly conformanceService: ConformanceService, @InjectConnection() private connection: Connection) {
    super(conformanceService);
  }

  protected getFilterFromQuery(query?: any) : any {
    let filter = super.getFilterFromQuery(query);

    if (!query) {
      return filter;
    }
    if ('resource.resourceType' in query) {
      filter['resource.resourceType'] = { $regex: query['resource.resourceType'], $options: 'i' };
    }
    return filter;
  }

  @Get(':id/Resource')
  public async getResource( @Param('id') id: string) : Promise<IImplementationGuide>
  {
    const results = await this.conformanceService.findById(id);
    if(results.resource.resourceType == 'ImplementationGuide') {
      return <IImplementationGuide>results.resource;
    }
  }
}
