import {BaseFhirController} from './base-fhir.controller';
import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {ICodeSystem, PaginateOptions} from '@trifolia-fhir/tof-lib';
import {AuthService} from './auth/auth.service';
import {IConformance} from '@trifolia-fhir/models';
import {ConformanceService} from './conformance/conformance.service';

@Controller('api/codeSystem')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Code System')
@ApiOAuth2([])
export class CodeSystemController extends BaseFhirController {
  resourceType = 'CodeSystem';

  protected readonly logger = new TofLogger(CodeSystemController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: ConformanceService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  @Get()
  public async search(@User() user, @FhirServerVersion() fhirServerVersion, @Query() query?: any, @RequestHeaders() headers?): Promise<any> {
    const searchFilters = {};

    if ('name' in query) {
      searchFilters['name'] = { $regex: query['name'], $options: 'i' };
    }
    searchFilters['resource.resourceType'] = { $regex: 'CodeSystem', $options: 'i' };
    searchFilters['fhirVersion'] = { $regex: fhirServerVersion, $options: 'i' };
    if (headers && headers['implementationguideid'] ) {
      searchFilters['igs'] =  { $regex: headers['implementationguideid'], $options: 'i' };
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
  public async get(@FhirServerVersion() fhirServerVersion,  @Query() query, @User() user, @Param('id') id: string) {
    const confResource: IConformance = await this.conformanceService.findById(id);
    if(confResource.resource.resourceType === 'CodeSystem')
    {
      return <ICodeSystem>confResource.resource;
    }
    return null;
  }

  @Post()
  public create( @FhirServerVersion() fhirServerVersion, @User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = true) {
    let conformance: any = { fhirVersion: fhirServerVersion, resource: body };
    this.conformanceService.createConformance(conformance, contextImplementationGuideId);
  }

  @Put(':id')
  public update( @FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = false) {
    let conformance: any = { fhirVersion: fhirServerVersion, resource: body };
    this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public delete(@FhirServerVersion() fhirServerVersion: 'stu3'|'r4'|'r5', @Param('id') id: string, @User() user) {
    return this.conformanceService.delete(id);
  }
}
