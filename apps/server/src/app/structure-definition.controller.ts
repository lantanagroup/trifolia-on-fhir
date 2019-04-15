import {BaseFhirController} from './base-fhir.controller';
import {BadRequestException, Body, Controller, Delete, Get, HttpService, Param, Post, Put, Req} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {StructureDefinition} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import * as config from 'config';
import {IFhirConfig} from './models/fhir-config';
import * as semver from 'semver';
import {ConfigController} from './config.controller';

const fhirConfig: IFhirConfig = config.get('fhir');

@Controller('structureDefinition')
export class StructureDefinitionController extends BaseFhirController {
  resourceType = 'StructureDefinition';

  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  @Get('base/:id')
  public getBaseStructureDefinition(@Req() request: ITofRequest, @Param('id') id: string): Promise<StructureDefinition> {
    const configController = new ConfigController(this.httpService);

    return configController.getFhirCapabilities(request)
      .then((capabilities) => {
        const publishedFhirVersion = (fhirConfig.publishedVersions || []).find((publishedVersion) => {
          return semver.satisfies(capabilities.fhirVersion, publishedVersion.version);
        });

        if (!publishedFhirVersion) {
          throw new BadRequestException(`Unsupported FHIR version ${capabilities.fhirVersion}`);
        }

        const options = {
          url: publishedFhirVersion.url + '/' + id + '.profile.json',
          method: 'GET',
          json: true
        };

        return this.httpService.request<StructureDefinition>(options).toPromise();
      })
      .then((results) => results.data);
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
