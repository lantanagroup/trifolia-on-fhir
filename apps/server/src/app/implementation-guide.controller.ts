import {BaseFhirController} from './base-fhir.controller';
import {Controller, Body, Delete, Get, HttpService, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import * as config from 'config';
import {IFhirConfig} from './models/fhir-config';
import {ITofRequest} from './models/tof-request';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import {AuthGuard} from '@nestjs/passport';

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
  public search(@Req() request: ITofRequest, query?: any): Promise<any> {
    return super.baseSearch(request.fhirServerBase, query);
  }

  @Get(':id')
  public get(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseGet(request.fhirServerBase, id, request.query);
  }

  @Post()
  public create(@Req() request: ITofRequest, @Body() body) {
    return super.baseCreate(request.fhirServerBase, body, request.query);
  }

  @Put(':id')
  public update(@Req() request: ITofRequest, @Param('id') id: string, @Body() body) {
    return super.baseUpdate(request.fhirServerBase, id, body, request.query);
  }

  @Delete()
  public delete(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseDelete(request.fhirServerBase, id, request.query);
  }
}
