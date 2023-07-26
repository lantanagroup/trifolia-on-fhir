import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {Paginated} from '@trifolia-fhir/tof-lib';
import {AuthService} from './auth/auth.service';
import {IFhirResource} from '@trifolia-fhir/models';
import {FhirResourcesService} from './fhirResources/fhirResources.service';
import {FhirResourcesController} from './fhirResources/fhirResources.controller';

@Controller('api/codeSystem')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Code System')
@ApiOAuth2([])
export class CodeSystemController extends FhirResourcesController {
  resourceType = 'CodeSystem';

  protected readonly logger = new TofLogger(CodeSystemController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: FhirResourcesService, protected configService: ConfigService) {
    super(conformanceService);
  }

  @Get()
  public async searchCodeSystem(@User() user, @Request() req?: any): Promise<Paginated<IFhirResource>> {
    return super.searchConformance(user, req);
  }

  @Get(':id')
  public async getCodeSystem(@User() user, @Param('id') id: string): Promise<IFhirResource> {
    return super.getById(user, id);
  }

  @Post()
  public async createCodeSystem(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IFhirResource = body;
    return this.conformanceService.createConformance(conformance, implementationGuideId);
  }

  @Put(':id')
  public async updateCodeSystem(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId ) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IFhirResource = body;
    return this.conformanceService.updateConformance(id,  conformance, implementationGuideId);
  }

  @Delete(':id')
  public async deleteCodeSystem(@User() user, @Param('id') id: string) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }
}
