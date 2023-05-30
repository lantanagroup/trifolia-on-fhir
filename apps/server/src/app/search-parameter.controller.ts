import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {ConformanceController} from './conformance/conformance.controller';
import {AuthService} from './auth/auth.service';
import {ConformanceService} from './conformance/conformance.service';
import {IConformance} from '@trifolia-fhir/models';
import {Paginated} from '@trifolia-fhir/tof-lib';

@Controller('api/searchParameter')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Search Parameter')
@ApiOAuth2([])
export class SearchParameterController extends ConformanceController {

  resourceType = 'SearchParameter';

  protected readonly logger = new TofLogger(SearchParameterController.name);

  constructor(protected authService: AuthService, protected httpService: HttpService, protected conformanceService: ConformanceService, protected configService: ConfigService) {
    super(conformanceService);
  }

  @Get()
  public async searchParameter(@User() user, @Request() req?: any): Promise<Paginated<IConformance>> {
    return super.searchConformance(user, req);

  }

  @Get(':id')
  public async getSearchParameter(@User() user, @Param('id') id: string): Promise<IConformance> {
    return super.getById(user, id);
  }

  @Post()
  public async createSearchParameter(@User() user, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IConformance = body;
    return this.conformanceService.createConformance(conformance, implementationGuideId);
  }

  @Put(':id')
  public async updateSearchParameter(@User() user, @Param('id') id: string, @Body() body, @RequestHeaders('implementationGuideId') implementationGuideId) {
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      await this.assertCanWriteById(user, implementationGuideId);
    }
    let conformance: IConformance = body;
    return this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public async deleteSearchParameter(@User() user, @Param('id') id: string ) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }
}
