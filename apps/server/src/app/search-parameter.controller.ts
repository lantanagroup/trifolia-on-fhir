import { BaseFhirController } from './base-fhir.controller';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TofLogger } from './tof-logger';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { FhirServerBase, FhirServerVersion, RequestHeaders, User } from './server.decorators';
import { ConfigService } from './config.service';
import {ConformanceController} from './conformance/conformance.controller';
import {AuthService} from './auth/auth.service';
import {ConformanceService} from './conformance/conformance.service';
import {IConformance} from '@trifolia-fhir/models';
import {Paginated, PaginateOptions} from '@trifolia-fhir/tof-lib';
import {ObjectId} from 'mongodb';

@Controller('api/searchParameter')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Search Parameter')
@ApiOAuth2([])
export class SearchParameterController extends ConformanceController {

  resourceType = 'SearchParameter';

  protected readonly logger = new TofLogger(SearchParameterController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: ConformanceService, protected configService: ConfigService) {
    super(conformanceService);
  }

  @Get()
  public async searchParameter(@User() user, @FhirServerVersion() fhirServerVersion, @Query() query?: any, @RequestHeaders() headers?): Promise<Paginated<IConformance>> {
    const searchFilters = {};

    if ('name' in query) {
      searchFilters['resource.name'] = { $regex: query['name'], $options: 'i' };
    }
    searchFilters['resource.resourceType'] = { $regex: 'SearchParameter', $options: 'i' };
    searchFilters['fhirVersion'] = { $regex: fhirServerVersion, $options: 'i' };
    if (headers && headers['implementationguideid'] ) {
      searchFilters['igIds'] =  new ObjectId(headers['implementationguideid']);
    }
    const baseFilter =  this.authService.getPermissionFilterBase(user, 'read');

    const filter = {
      $and: [ baseFilter, searchFilters]
    };

    const options: PaginateOptions = {
      page: query.page,
      itemsPerPage: 10,
      filter: filter
    };

    options.sortBy = {};
    if ('_sort' in query) {
      options.sortBy[query['_sort']] = 'asc';
    }

    return await this.conformanceService.search(options);

  }

  @Get(':id')
  public async getSearchParameter(@FhirServerVersion() fhirServerVersion,  @Query() query, @User() user, @Param('id') id: string): Promise<IConformance> {
    return super.getById(user, id);
  }

  @Post()
  public createSearchParameter(@FhirServerVersion() fhirServerVersion, @User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = true) {
    let conformance: IConformance = body;
    conformance.fhirVersion = fhirServerVersion;
    return this.conformanceService.createConformance(conformance, contextImplementationGuideId);
  }

  @Put(':id')
  public async updateSearchParameter(@FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = false) {
    await this.assertCanWriteById(user, id);
    let conformance: IConformance = body;
    conformance.fhirVersion = fhirServerVersion;
    return this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public async deleteSearchParameter(@FhirServerVersion() fhirServerVersion: 'stu3'|'r4'|'r5', @Param('id') id: string, @User() user) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.delete(id);
  }
}
