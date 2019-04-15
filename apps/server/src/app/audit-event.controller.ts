import {Controller, Get, HttpService, Param, Req} from '@nestjs/common';
import {BaseFhirController} from './base-fhir.controller';
import {ITofRequest} from './models/tof-request';

@Controller('auditEvent')
export class AuditEventController extends BaseFhirController {
  resourceType = 'AuditEvent';

  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  @Get()
  search(@Req() request: ITofRequest) {
    return super.baseSearch(request.fhirServerBase, request.query);
  }

  @Get(':id')
  get(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseGet(request.fhirServerBase, id, request.query);
  }
}
