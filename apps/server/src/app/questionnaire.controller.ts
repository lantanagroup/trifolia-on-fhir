import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import { RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {Paginated} from '@trifolia-fhir/tof-lib';
import {AuditAction, AuditEntityType, IFhirResource} from '@trifolia-fhir/models';
import {FhirResourcesController} from './fhir-resources/fhir-resources.controller';
import {AuthService} from './auth/auth.service';
import {FhirResourcesService} from './fhir-resources/fhir-resources.service';
import { AuditEntity } from './audit/audit.decorator';

@Controller('api/questionnaires')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Questionnaire')
@ApiOAuth2([])
export class QuestionnaireController extends FhirResourcesController {
  resourceType = 'Questionnaire';

  protected readonly logger = new TofLogger(QuestionnaireController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected fhirResourcesService: FhirResourcesService, protected configService: ConfigService) {
    super(fhirResourcesService);
  }

  @Get()
  public async questionnaire(@User() user, @Request() req?: any): Promise<Paginated<IFhirResource>> {
    return super.searchFhirResource(user, req);

  }

  @Get(':id')
  public async getQuestionnaire(@User() user, @Param('id') id: string): Promise<IFhirResource> {
    return super.getById(user, id);
  }

  @Post()
  @AuditEntity(AuditAction.Create, AuditEntityType.FhirResource)
  public async createQuestionnaire(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let fhirResource: IFhirResource = body;
    return this.fhirResourcesService.createFhirResource(fhirResource, implementationGuideId);
  }

  @Put(':id')
  @AuditEntity(AuditAction.Update, AuditEntityType.FhirResource)
  public async updateQuestionnaire(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let fhirResource: IFhirResource = body;
    return this.fhirResourcesService.updateFhirResource(id, fhirResource, implementationGuideId);
  }

  @Delete(':id')
  @AuditEntity(AuditAction.Delete, AuditEntityType.FhirResource)
  public async deleteQuestionnaire(@User() user, @Param('id') id: string ) {
    await this.assertCanWriteById(user, id);
    return this.fhirResourcesService.deleteFhirResource(id);
  }

}
