import {BaseFhirController} from './base-fhir.controller';
import {Controller, Body, Delete, Get, HttpService, Param, Post, Put, Req, UseGuards, Query} from '@nestjs/common';
import {ITofUser} from './models/tof-request';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirInstance, FhirServerBase, FhirServerId, FhirServerVersion, User} from './server.decorators';
import {ConfigService} from './config.service';
import {BundleExporter} from './export/bundle';
import {getHumanNameDisplay, getHumanNamesDisplay} from '../../../../libs/tof-lib/src/lib/helper';

interface PublishedGuidesModel {
  guides: [{
    name: string;
    'npm-name': string;
    editions: [{
      url: string;
      version: string;
    }]
  }];
}

@Controller('api/implementationGuide')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Implementation Guide')
@ApiOAuth2Auth()
export class ImplementationGuideController extends BaseFhirController {
  resourceType = 'ImplementationGuide';

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  @Get('published')
  public getPublishedGuides(): Promise<any> {
    if (!this.configService.fhir.publishedGuides) {
      throw new InvalidModuleConfigException('Server is not configured with a publishedGuides property');
    }

    return this.httpService.get(this.configService.fhir.publishedGuides).toPromise()
      .then((results) => {
        const guides = [];

        if (results.data && results.data.guides) {
          results.data.guides.forEach((guide) => {
            if (guide.editions) {
              guide.editions.forEach((edition) => {
                guides.push({
                  name: guide.name,
                  url: edition.url,
                  version: edition['ig-version'],
                  'npm-name': guide['npm-name']
                });
              });
            }
          });
        }

        return guides;
      })
  }

  @Get()
  public search(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Query() query?: any) {
    return super.baseSearch(user, fhirServerBase, query);
  }

  @Get(':id')
  public get(@FhirServerBase() fhirServerBase: string, @Query() query, @User() user, @Param('id') id: string) {
    return super.baseGet(fhirServerBase, id, query, user);
  }

  @Post()
  public create(@FhirServerBase() fhirServerBase: string, @User() user: ITofUser, @Body() body) {
    return super.baseCreate(fhirServerBase, body, user);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase: string, @Param('id') id: string, @Body() body, @User() user) {
    return super.baseUpdate(fhirServerBase, id, body, user);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase: string, @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, id, user);
  }

  @Get(':id/list')
  public async getResourceList(@FhirServerBase() fhirServerBase: string, @FhirServerId() fhirServerId: string, @FhirServerVersion() fhirServerVersion: string, @FhirInstance() fhir, @Param('id') id: string) {
    const exporter = new BundleExporter(this.httpService, this.logger, fhirServerBase, fhirServerId, fhirServerVersion, fhir, id);
    const bundle = await exporter.getBundle(false, true);

    return (bundle.entry || []).map((entry) => {
      const resource = <any> entry.resource;
      const ret = {
        resourceType: resource.resourceType,
        id: resource.id,
        display: resource.title || resource.name
      };

      if (ret.display instanceof Array) {
        ret.display = getHumanNamesDisplay(ret.display);
      } else if (typeof ret.display === 'object') {
        ret.display = getHumanNameDisplay(ret.display);
      }

      return ret;
    });
  }
}
