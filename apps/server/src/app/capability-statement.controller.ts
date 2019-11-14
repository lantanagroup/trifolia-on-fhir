import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';

@Controller('api/capabilityStatement')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Capability Statement')
@ApiOAuth2Auth()
export class CapabilityStatementController extends BaseFhirController {
  resourceType = 'CapabilityStatement';

  protected readonly logger = new TofLogger(CapabilityStatementController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
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
  public delete(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion: 'stu3'|'r4', @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, fhirServerVersion, id, user);
  }
}
