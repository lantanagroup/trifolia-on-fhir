import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, User} from './server.decorators';

@Controller('codeSystem')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Code System')
@ApiOAuth2Auth()
export class CodeSystemController extends BaseFhirController {
  resourceType = 'CodeSystem';
  
  protected readonly logger = new TofLogger(CodeSystemController.name);
  
  constructor(protected httpService: HttpService) {
    super(httpService);
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
