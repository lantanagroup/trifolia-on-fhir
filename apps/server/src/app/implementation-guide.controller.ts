import {BaseFhirController} from './base-fhir.controller';
import {Controller, Body, Delete, Get, HttpService, Param, Post, Put, Req, UseGuards, Query} from '@nestjs/common';
import * as config from 'config';
import {IFhirConfig} from './models/fhir-config';
import {ITofRequest} from './models/tof-request';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, User} from './server.decorators';

const fhirConfig: IFhirConfig = config.get('fhir');

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

@Controller('implementationGuide')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Implementation Guide')
@ApiOAuth2Auth()
export class ImplementationGuideController extends BaseFhirController {
  resourceType = 'ImplementationGuide';

  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  @Get('published')
  public getPublishedGuides(): Promise<any> {
    if (!fhirConfig.publishedGuides) {
      throw new InvalidModuleConfigException('Server is not configured with a publishedGuides property');
    }

    return this.httpService.get(fhirConfig.publishedGuides).toPromise()
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
  public search(@User() user, @FhirServerBase() fhirServerBase, @Query() query?: any): Promise<any> {
    return super.baseSearch(user, fhirServerBase, query);
  }

  @Get(':id')
  public get(@FhirServerBase() fhirServerBase, @Query() query, @User() user, @Param('id') id: string) {
    return super.baseGet(fhirServerBase, id, query, user);
  }

  @Post()
  public create(@FhirServerBase() fhirServerBase, @User() user, @Body() body) {
    return super.baseCreate(fhirServerBase, body, user);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @Param('id') id: string, @Body() body, @User() user) {
    return super.baseUpdate(fhirServerBase, id, body, user);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, id, user);
  }
}
