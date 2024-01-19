import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {Paginated} from '@trifolia-fhir/tof-lib';
import {AuthService} from './auth/auth.service';
import {AuditAction, AuditEntityType, IFhirResource} from '@trifolia-fhir/models';
import {FhirResourcesService} from './fhir-resources/fhir-resources.service';
import {FhirResourcesController} from './fhir-resources/fhir-resources.controller';
import { AuditEntity } from './audit/audit.decorator';

@Controller('api/codeSystems')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Code System')
@ApiOAuth2([])
export class CodeSystemController extends FhirResourcesController {
  resourceType = 'CodeSystem';

  protected readonly logger = new TofLogger(CodeSystemController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected fhirResourceService: FhirResourcesService, protected configService: ConfigService) {
    super(fhirResourceService);
  }

  @Get()
  public async searchCodeSystem(@User() user, @Request() req?: any): Promise<Paginated<IFhirResource>> {
    return super.searchFhirResource(user, req);
  }

  @Get(':id')
  @AuditEntity(AuditAction.Read, AuditEntityType.FhirResource)
  public async getCodeSystem(@User() user, @Param('id') id: string): Promise<IFhirResource> {
    return super.getById(user, id);
  }

  @Post()
  @AuditEntity(AuditAction.Create, AuditEntityType.FhirResource)
  public async createCodeSystem(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let fhirResource: IFhirResource = body;
    return this.fhirResourceService.createFhirResource(fhirResource, implementationGuideId);
  }

  @Put(':id')
  @AuditEntity(AuditAction.Update, AuditEntityType.FhirResource)
  public async updateCodeSystem(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId ) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let fhirResource: IFhirResource = body;
    return this.fhirResourceService.updateFhirResource(id,  fhirResource, implementationGuideId);
  }

  @Delete(':id')
  @AuditEntity(AuditAction.Delete, AuditEntityType.FhirResource)
  public async deleteCodeSystem(@User() user, @Param('id') id: string) {
    await this.assertCanWriteById(user, id);
    return this.fhirResourceService.deleteFhirResource(id);
  }
}
