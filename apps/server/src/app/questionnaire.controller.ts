import {BaseFhirController} from './base-fhir.controller';
import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import { FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {Paginated} from '@trifolia-fhir/tof-lib';
import {IFhirResource} from '@trifolia-fhir/models';
import {FhirResourcesController} from './fhirResources/fhirResources.controller';
import {AuthService} from './auth/auth.service';
import {FhirResourcesService} from './fhirResources/fhirResources.service';

@Controller('api/questionnaire')
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
  public async createQuestionnaire(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let fhirResource: IFhirResource = body;
    return this.fhirResourcesService.createFhirResource(fhirResource, implementationGuideId);
  }

  @Put(':id')
  public async updateQuestionnaire(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IFhirResource = body;
    return this.fhirResourcesService.updateFhirResource(id, conformance, implementationGuideId);
  }

  @Delete(':id')
  public async deleteQuestionnaire(@User() user, @Param('id') id: string ) {
    await this.assertCanWriteById(user, id);
    return this.fhirResourcesService.deleteFhirResource(id);
  }

}
