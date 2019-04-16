import {BaseFhirController} from './base-fhir.controller';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpService,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {
  Bundle,
  ImplementationGuide as STU3ImplementationGuide,
  PackageResourceComponent,
  StructureDefinition
} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {IFhirConfig} from './models/fhir-config';
import {ConfigController} from './config.controller';
import {AuthGuard} from '@nestjs/passport';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {
  GetStructureDefinitionModel,
  StructureDefinitionImplementationGuide,
  StructureDefinitionOptions
} from '../../../client/src/app/shared/structure-definition.service';
import * as config from 'config';
import * as semver from 'semver';
import * as nanoid from 'nanoid';
import {TofNotFoundException} from '../not-found-exception';

const fhirConfig: IFhirConfig = config.get('fhir');

interface SaveStructureDefinitionRequest {
  options?: StructureDefinitionOptions;
  resource: StructureDefinition;
}

@Controller('structureDefinition')
@UseGuards(AuthGuard('bearer'))
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

  protected prepareSearchQuery(query?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      super.prepareSearchQuery(query)
        .then((preparedQuery) => {
          if (preparedQuery.implementationGuideId) {
            preparedQuery['_has:ImplementationGuide:resource:_id'] = preparedQuery.implementationGuideId;
            delete preparedQuery.implementationGuideId;
          }

          resolve(preparedQuery);
        })
        .catch((err) => reject(err));
    });
  }

  @Get()
  public search(@Req() request: ITofRequest, query?: any): Promise<any> {
    return super.baseSearch(request.fhirServerBase, query);
  }

  @Get(':id')
  public async get(@Req() request: ITofRequest, @Param('id') id: string): Promise<GetStructureDefinitionModel> {
    const url = buildUrl(request.fhirServerBase, this.resourceType, id, null, request.query);
    const requestOptions = {
      url: url,
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    };
    let structureDefinition;

    try {
      const results = await this.httpService.request<StructureDefinition>(requestOptions).toPromise();
      structureDefinition = results.data;
    } catch (ex) {
      if (ex.response.status === 404) {
        throw new TofNotFoundException();
      }
      throw ex;
    }

    const igRequestOptions = {
      url: buildUrl(request.fhirServerBase, 'ImplementationGuide', null, null, { resource: `StructureDefinition/${id}` }),
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    };

    const igResults = await this.httpService.request<Bundle>(igRequestOptions).toPromise();

    return {
      resource: structureDefinition,
      options: {
        implementationGuides: (igResults.data.entry || []).map((entry) => {
          const ig = <STU3ImplementationGuide> entry.resource;
          return new StructureDefinitionImplementationGuide(entry.resource.id, ig.name);
        })
      }
    }
  }
  /**
   * Adds a structure definition to the specified implementation guide
   * @param structureDefinition The structure definition to add (must have an id)
   * @param implementationGuideId The id of the implementation guide to add the structure definition to
   */
  private async addToImplementationGuide(fhirServerBase: string, fhirServerVersion: string, structureDefinition: StructureDefinition, implementationGuideId: string): Promise<void> {
    const igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', implementationGuideId);
    const igResults = await this.httpService.get<STU3ImplementationGuide | R4ImplementationGuide>(igUrl).toPromise();
    const implementationGuide = igResults.data;

    this.assertEditingAllowed(igResults.data);

    if (fhirServerVersion !== 'stu3') {        // r4+
      const r4 = <R4ImplementationGuide> implementationGuide;

      r4.definition = r4.definition || { resource: [] };
      r4.definition.resource = r4.definition.resource || [];

      const foundResource = r4.definition.resource.find((resource) => {
        if (resource.reference) {
          return resource.reference.reference === `StructureDefinition/${structureDefinition.id}`;
        }
      });

      if (!foundResource) {
        r4.definition.resource.push({
          reference: {
            reference: `StructureDefinition/${structureDefinition.id}`,
            display: structureDefinition.title || structureDefinition.name
          }
        });
      }
    } else {                                        // stu3
      const stu3 = <STU3ImplementationGuide> implementationGuide;

      stu3.package = stu3.package || [];

      const foundInPackages = (stu3.package || []).filter((igPackage) => {
        return (igPackage.resource || []).filter((resource) => {
          if (resource.sourceReference && resource.sourceReference.reference) {
            return resource.sourceReference.reference === `StructureDefinition/${structureDefinition.id}`;
          }
        }).length > 0;
      });

      if (foundInPackages.length === 0) {
        const newResource: PackageResourceComponent = {
          name: structureDefinition.title || structureDefinition.name,
          sourceReference: {
            reference: `StructureDefinition/${structureDefinition.id}`,
            display: structureDefinition.title || structureDefinition.name
          },
          example: false
        };

        if (stu3.package.length === 0) {
          stu3.package.push({
            name: 'Default Package',
            resource: [newResource]
          });
        } else {
          if (!stu3.package[0].resource) {
            stu3.package[0].resource = [];
          }

          stu3.package[0].resource.push(newResource);
        }
      }
    }

    const updateOptions = {
      method: 'PUT',
      url: igUrl,
      data: implementationGuide
    };

    await this.httpService.request(updateOptions).toPromise();
  }

  /**
   * Removes the structure definition from the specified implementation guide
   * @param structureDefinition The structure definition to remove (must have an id)
   * @param implementationGuideId The id of the implementation guide to remove the structure definition from
   */
  private async removeFromImplementationGuide(fhirServerBase: string, fhirServerVersion: string, structureDefinition: StructureDefinition, implementationGuideId: string): Promise<void> {
    const igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', implementationGuideId);
    const igResults = await this.httpService.get<STU3ImplementationGuide | R4ImplementationGuide>(igUrl).toPromise();
    const implementationGuide = igResults.data;

    this.assertEditingAllowed(implementationGuide);

    if (fhirServerVersion !== 'stu3') {                // r4+
      const r4 = <R4ImplementationGuide> implementationGuide;

      r4.definition = r4.definition || { resource: [] };
      r4.definition.resource = r4.definition.resource || [];

      const foundResource = r4.definition.resource.find((resource) => {
        if (resource.reference) {
          return resource.reference.reference === `StructureDefinition/${structureDefinition.id}`;
        }
      });

      if (foundResource) {
        const index = r4.definition.resource.indexOf(foundResource);
        r4.definition.resource.splice(index, 1);
      }
    } else {                                                // stu3
      const stu3 = <STU3ImplementationGuide> implementationGuide;

      stu3.package = stu3.package || [];

      stu3.package.forEach((igPackage) => {
        const foundResource = (igPackage.resource || []).find((resource) => {
          if (resource.sourceReference && resource.sourceReference.reference) {
            return resource.sourceReference.reference === `StructureDefinition/${structureDefinition.id}`;
          }
        });

        if (foundResource) {
          const index = igPackage.resource.indexOf(foundResource);
          igPackage.resource.splice(index, 1);
        }
      });
    }

    const updateOptions = {
      method: 'PUT',
      url: igUrl,
      data: implementationGuide
    };

    await this.httpService.request(updateOptions).toPromise();
  }

  private async saveStructureDefinition(fhirServerBase: string, fhirServerVersion: string, id: string, structureDefinition: StructureDefinition, options?: StructureDefinitionOptions) {
    this.assertEditingAllowed(structureDefinition);

    if (!structureDefinition) {
      throw new BadRequestException();
    }

    if (!structureDefinition.id) {
      structureDefinition.id = id;
    }

    const updateOptions = {
      url: buildUrl(fhirServerBase, this.resourceType, id),
      method: 'PUT',
      data: structureDefinition
    };

    const updateResults = await this.httpService.request(updateOptions).toPromise();
    const updatedLocation = updateResults.headers.location || updateResults.headers['content-location'];

    if (!updatedLocation) {
      throw new InternalServerErrorException(`FHIR server did not respond with a location to the newly created ${this.resourceType}`);
    }

    const getResults = await this.httpService.get<StructureDefinition>(updatedLocation).toPromise();
    const updatedStructureDefinition = getResults.data;

    const igUpdatePromises = [];

    if (options) {
      options.implementationGuides.forEach((implementationGuide) => {
        if (implementationGuide.isNew) {
          igUpdatePromises.push(this.addToImplementationGuide(fhirServerBase, fhirServerVersion, updatedStructureDefinition, implementationGuide.id));
        } else if (implementationGuide.isRemoved) {
          igUpdatePromises.push(this.removeFromImplementationGuide(fhirServerBase, fhirServerVersion, updatedStructureDefinition, implementationGuide.id));
        }
      });
    }

    await Promise.all(igUpdatePromises);

    return updatedStructureDefinition;
  }

  @Post()
  public create(@Req() request: ITofRequest, @Body() body) {
    return this.saveStructureDefinition(request.fhirServerBase, request.fhirServerVersion, nanoid(8), body.resource, body.options);
  }

  @Put(':id')
  public update(@Req() request: ITofRequest, @Param('id') id: string, @Body() body: SaveStructureDefinitionRequest) {
    return this.saveStructureDefinition(request.fhirServerBase, request.fhirServerVersion, id, body.resource, body.options);
  }

  @Delete()
  public delete(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseDelete(request.fhirServerBase, id, request.query);
  }
}
