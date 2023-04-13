import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {Paginated} from '@trifolia-fhir/tof-lib';
import {AuthService} from './auth/auth.service';
import {IConformance} from '@trifolia-fhir/models';
import {ConformanceService} from './conformance/conformance.service';
import {ConformanceController} from './conformance/conformance.controller';

@Controller('api/codeSystem')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Code System')
@ApiOAuth2([])
export class CodeSystemController extends ConformanceController {
  resourceType = 'CodeSystem';

  protected readonly logger = new TofLogger(CodeSystemController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: ConformanceService, protected configService: ConfigService) {
    super(conformanceService);
  }

  @Get()
  public async searchCodeSystem(@User() user, @Request() req?: any): Promise<Paginated<IConformance>> {
    return super.searchConformance(user, req);
  }

  @Get(':id')
  public async getCodeSystem(@User() user, @Param('id') id: string): Promise<IConformance> {
    return super.getById(user, id);
  }

  @Post()
  public createCodeSystem(@User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId) {
    let conformance: IConformance = body;
    return this.conformanceService.createConformance(conformance, contextImplementationGuideId);
  }

  @Put(':id')
  public async updateCodeSystem(@User() user, @Param('id') id: string, @Body() body ) {
    await this.assertCanWriteById(user, id);
    let conformance: IConformance = body;
    return this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public async deleteCodeSystem(@User() user, @Param('id') id: string) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }
}
