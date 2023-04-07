import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, HttpException, NotFoundException, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {Paginated, PaginateOptions} from '@trifolia-fhir/tof-lib';
import {AuthService} from './auth/auth.service';
import {IConformance} from '@trifolia-fhir/models';
import {ConformanceService} from './conformance/conformance.service';
import { ObjectId } from 'mongodb';
import { ConformanceController } from './conformance/conformance.controller';

@Controller('api/codeSystem')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Code System')
@ApiOAuth2([])
export class CodeSystemController extends ConformanceController {
  resourceType = 'CodeSystem';

  protected readonly logger = new TofLogger(CodeSystemController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: ConformanceService, protected configService: ConfigService) {
    super(conformanceService);
  }

  @Get()
  public async searchCodeSystem(@User() user, @FhirServerVersion() fhirServerVersion, @Query() query?: any, @RequestHeaders() headers?): Promise<Paginated<IConformance>> {
    const searchFilters = {};

    if ('name' in query) {
      searchFilters['resource.name'] = { $regex: query['name'], $options: 'i' };
    }
    searchFilters['resource.resourceType'] = { $regex: 'CodeSystem', $options: 'i' };
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
  public async getCodeSystem(@FhirServerVersion() fhirServerVersion,  @Query() query, @User() user, @Param('id') id: string): Promise<IConformance> {
    return super.getById(user, id);
  }

  @Post()
  public createCodeSystem(@FhirServerVersion() fhirServerVersion, @User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = true) {
    let conformance: IConformance = body;
    conformance.fhirVersion = fhirServerVersion;
    return this.conformanceService.createConformance(conformance, contextImplementationGuideId);
  }

  @Put(':id')
  public async updateCodeSystem(@FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = false) {
    await this.assertCanWriteById(user, id);
    let conformance: IConformance = body;
    conformance.fhirVersion = fhirServerVersion;
    return this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public async deleteCodeSystem(@FhirServerVersion() fhirServerVersion: 'stu3'|'r4'|'r5', @Param('id') id: string, @User() user) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.delete(id);
  }
}
