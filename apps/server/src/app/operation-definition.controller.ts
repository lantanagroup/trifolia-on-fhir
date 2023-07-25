import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {ConformanceController} from './conformance/conformance.controller';
import {AuthService} from './auth/auth.service';
import {ConformanceService} from './conformance/conformance.service';
import {Paginated} from '@trifolia-fhir/tof-lib';
import {IFhirResource} from '@trifolia-fhir/models';


@Controller('api/operationDefinition')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Operation Definition')
@ApiOAuth2([])
export class OperationDefinitionController extends ConformanceController {
  resourceType = 'OperationDefinition';

  protected readonly logger = new TofLogger(OperationDefinitionController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: ConformanceService, protected configService: ConfigService) {
    super(conformanceService);
  }

  @Get()
  public async operationDefinition(@User() user, @Request() req?: any): Promise<Paginated<IFhirResource>> {
    return super.searchConformance(user, req);

  }

  @Get(':id')
  public async getOperationDefinition(@User() user, @Param('id') id: string): Promise<IFhirResource> {
    return super.getById(user, id);
  }

  @Post()
  public async createOperationDefinition(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IFhirResource = body;
    return this.conformanceService.createConformance(conformance, implementationGuideId);
  }

  @Put(':id')
  public async updateOperationDefinition(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IFhirResource = body;
    return this.conformanceService.updateConformance(id, conformance, implementationGuideId);
  }

  @Delete(':id')
  public async deleteOperationDefinition(@User() user, @Param('id') id: string ) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }
}
