import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {FhirResourcesController} from './fhirResources/fhirResources.controller';
import {FhirResourcesService} from './fhirResources/fhirResources.service';
import {AuthService} from './auth/auth.service';
import {IFhirResource} from '@trifolia-fhir/models';

@Controller('api/capabilityStatement')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Capability Statement')
@ApiOAuth2([])
export class CapabilityStatementController extends FhirResourcesController {
  resourceType = 'CapabilityStatement';

  protected readonly logger = new TofLogger(CapabilityStatementController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: FhirResourcesService, protected configService: ConfigService) {
    super(conformanceService);
  }
  @Get(':id')
  public async getCapabilityStatement(@User() user, @Param('id') id: string): Promise<IFhirResource> {
    return super.getById(user, id);
  }

  @Post()
  public async createCapabilityStatement(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IFhirResource = body;
    return this.conformanceService.createConformance(conformance, implementationGuideId);
  }

  @Put(':id')
  public async updateCapabilityStatement(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IFhirResource = body;
    return this.conformanceService.updateConformance(id, conformance, implementationGuideId);
  }

  @Delete(':id')
  public async deleteCapabilityStatement(@User() user, @Param('id') id: string ) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }
}
