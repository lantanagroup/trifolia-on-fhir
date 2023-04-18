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
import {IConformance} from '@trifolia-fhir/models';


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
  public async operationDefinition(@User() user, @Request() req?: any): Promise<Paginated<IConformance>> {
    return super.searchConformance(user, req);

  }

  @Get(':id')
  public async getOperationDefinition(@User() user, @Param('id') id: string): Promise<IConformance> {
    return super.getById(user, id);
  }

  @Post()
  public createOperationDefinition(@User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId) {
    let conformance: IConformance = body;
    return this.conformanceService.createConformance(conformance, contextImplementationGuideId);
  }

  @Put(':id')
  public async updateOperationDefinition(@User() user, @Param('id') id: string, @Body() body) {
    await this.assertCanWriteById(user, id);
    let conformance: IConformance = body;
    return this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public async deleteOperationDefinition(@User() user, @Param('id') id: string ) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }
}
