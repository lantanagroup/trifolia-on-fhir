import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {ConformanceController} from './conformance/conformance.controller';
import {ConformanceService} from './conformance/conformance.service';
import {AuthService} from './auth/auth.service';
import {IConformance} from '@trifolia-fhir/models';

@Controller('api/capabilityStatement')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Capability Statement')
@ApiOAuth2([])
export class CapabilityStatementController extends ConformanceController {
  resourceType = 'CapabilityStatement';

  protected readonly logger = new TofLogger(CapabilityStatementController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: ConformanceService, protected configService: ConfigService) {
    super(conformanceService);
  }
  @Get(':id')
  public async getCapabilityStatement(@User() user, @Param('id') id: string): Promise<IConformance> {
    return super.getById(user, id);
  }

  @Post()
  public createCapabilityStatement(@User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId) {
    let conformance: IConformance = body;
    return this.conformanceService.createConformance(conformance, contextImplementationGuideId);
  }

  @Put(':id')
  public async updateCapabilityStatement(@User() user, @Param('id') id: string, @Body() body) {
    await this.assertCanWriteById(user, id);
    let conformance: IConformance = body;
    return this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public async deleteCapabilityStatement(@User() user, @Param('id') id: string ) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }
}
