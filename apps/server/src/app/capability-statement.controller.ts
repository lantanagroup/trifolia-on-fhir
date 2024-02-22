import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {FhirResourcesController} from './fhir-resources/fhir-resources.controller';
import {FhirResourcesService} from './fhir-resources/fhir-resources.service';
import {AuthService} from './auth/auth.service';
import {AuditAction, AuditEntityType, IFhirResource} from '@trifolia-fhir/models';
import { AuditEntity } from './audit/audit.decorator';

@Controller('api/capabilityStatements')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Capability Statement')
@ApiOAuth2([])
export class CapabilityStatementController extends FhirResourcesController {
  resourceType = 'CapabilityStatement';

  protected readonly logger = new TofLogger(CapabilityStatementController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected fhirResourcesService: FhirResourcesService, protected configService: ConfigService) {
    super(fhirResourcesService);
  }
  @Get(':id')
  @AuditEntity(AuditAction.Read, AuditEntityType.FhirResource)
  public async getCapabilityStatement(@User() user, @Param('id') id: string): Promise<IFhirResource> {
    return super.getById(user, id);
  }

  @Post()
  @AuditEntity(AuditAction.Create, AuditEntityType.FhirResource)
  public async createCapabilityStatement(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let fhirResource: IFhirResource = body;
    return this.fhirResourcesService.createFhirResource(fhirResource, implementationGuideId);
  }

  @Put(':id')
  @AuditEntity(AuditAction.Update, AuditEntityType.FhirResource)
  public async updateCapabilityStatement(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let fhirResource: IFhirResource = body;
    return this.fhirResourcesService.updateFhirResource(id, fhirResource, implementationGuideId);
  }

  @Delete(':id')
  @AuditEntity(AuditAction.Delete, AuditEntityType.FhirResource)
  public async deleteCapabilityStatement(@User() user, @Param('id') id: string ) {
    await this.assertCanWriteById(user, id);
    return this.fhirResourcesService.deleteFhirResource(id);
  }
}
