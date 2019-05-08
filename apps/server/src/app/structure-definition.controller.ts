import {BaseFhirController} from './base-fhir.controller';
import {BadRequestException, Body, Controller, Delete, Get, HttpService, InternalServerErrorException, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ITofRequest, ITofUser} from './models/tof-request';
import {Bundle, ImplementationGuide as STU3ImplementationGuide, PackageResourceComponent, StructureDefinition} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {AuthGuard} from '@nestjs/passport';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {GetStructureDefinitionModel, StructureDefinitionImplementationGuide, StructureDefinitionOptions} from '../../../client/src/app/shared/structure-definition.service';
import {TofNotFoundException} from '../not-found-exception';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {StructureDefinition as PCStructureDefinition} from 'fhir/parseConformance';
import {SnapshotGenerator} from 'fhir/snapshotGenerator';
import {FhirServerBase, User} from './server.decorators';
import {ConfigService} from './config.service';
import nanoid from 'nanoid';

interface SaveStructureDefinitionRequest {
  options?: StructureDefinitionOptions;
  resource: StructureDefinition;
}

@Controller('structureDefinition')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Structure Definition')
@ApiOAuth2Auth()
export class StructureDefinitionController extends BaseFhirController {
  resourceType = 'StructureDefinition';

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  /**
   * Gets all possible base definitions for the given type
   * @param request
   * @param type
   */
  @Get('base/:type')
  public async getBaseStructureDefinitions(@Req() request: ITofRequest, @Param('type') type: string): Promise<string[]> {
    const url = buildUrl(request.fhirServerBase, 'StructureDefinition', null, null, { type: type });
    const results = await this.httpService.get<Bundle>(url).toPromise();

    const ret = (results.data.entry || []).map((entry) => {
      const structureDefinition = <StructureDefinition> entry.resource;
      return structureDefinition.url;
    });

    // Add the base definition from the spec for the type
    ret.splice(0, 0, `http://hl7.org/fhir/StructureDefinition/${type}`);

    return ret;
  }

  /**
   * Gets the base structure definition specified by the url.
   * Ensures that the structure definition returned has a snapshot.
   * @param request The express request object
   * @param url The url of the base profile to return
   */
  @Get('base')
  public async getBaseStructureDefinition(@Req() request: ITofRequest, @Query('url') url: string) {
    // Recursive function to get all base profiles for a given url
    const getNextBase = async (baseUrl: string, list: StructureDefinition[] = []) => {
      const foundBaseProfile = request.fhir.parser.structureDefinitions.find((sd) => sd.url === baseUrl);
      if (foundBaseProfile) {
        list.push(foundBaseProfile);
      } else {
        const url = buildUrl(request.fhirServerBase, 'StructureDefinition', null, null, {url: baseUrl});
        const results = await this.httpService.get<Bundle>(url).toPromise();

        if (!results.data || results.data.total !== 1) {
          throw new Error(`Could not find base profile ${baseUrl}`);
        }

        const base = <StructureDefinition>results.data.entry[0].resource;

        list.push(base);
        await getNextBase(base.baseDefinition, list);
      }

      return list;
    };

    let baseProfiles;

    try {
      baseProfiles = await getNextBase(url);
    } catch (ex) {
      // Extra logic in case one of the base profiles aren't present... Should at least respond with a snapshot base don the core spec
      const getProfileUrl = buildUrl(request.fhirServerBase, 'StructureDefinition', null, null, { url: url });
      const getProfileResults = await this.httpService.get<Bundle>(getProfileUrl).toPromise();

      if (!getProfileResults.data || getProfileResults.data.total !== 1) {
        throw new Error(`Could not find profile with URL ${url}`);
      }

      const profile = <StructureDefinition> getProfileResults.data.entry[0].resource;
      const baseUrl = 'http://hl7.org/fhir/StructureDefinition/' + profile.type;
      const baseTypeProfile = request.fhir.parser.structureDefinitions.find((sd) => sd.url === baseUrl);

      if (!baseTypeProfile) {
        throw new Error(`Can't find base profile for ${baseUrl}`);
      }

      const originalBaseDefinition = profile.baseDefinition;
      profile.baseDefinition = baseTypeProfile.url;
      request.fhir.generateSnapshot(SnapshotGenerator.createBundle(baseTypeProfile, <PCStructureDefinition> profile));
      profile.baseDefinition = originalBaseDefinition;
      return profile;
    }

    const found = baseProfiles.find((baseProfile) => baseProfile.url === url);

    if (!found.snapshot) {
      const baseProfilesBundle = SnapshotGenerator.createBundle(...(<PCStructureDefinition[]>baseProfiles));
      request.fhir.generateSnapshot(baseProfilesBundle);
    }

    return found;
  }

  protected async prepareSearchQuery(user: ITofUser, fhirServerBase: string, query?: any): Promise<any> {
    const preparedQuery = await super.prepareSearchQuery(user, fhirServerBase, query);

    if (preparedQuery.implementationGuideId) {
      preparedQuery['_has:ImplementationGuide:resource:_id'] = preparedQuery.implementationGuideId;
      delete preparedQuery.implementationGuideId;
    }

    return preparedQuery;
  }

  @Get()
  public search(@User() user, @FhirServerBase() fhirServerBase, @Query() query?: any): Promise<any> {
    return super.baseSearch(user, fhirServerBase, query);
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
      url: buildUrl(request.fhirServerBase, 'ImplementationGuide', null, null, {resource: `StructureDefinition/${id}`}),
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
          const ig = <STU3ImplementationGuide>entry.resource;
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
  private async addToImplementationGuide(fhirServerBase: string, fhirServerVersion: string, structureDefinition: StructureDefinition, implementationGuideId: string, user: ITofUser): Promise<void> {
    const igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', implementationGuideId);
    const igResults = await this.httpService.get<STU3ImplementationGuide | R4ImplementationGuide>(igUrl).toPromise();
    const implementationGuide = igResults.data;

    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);
    this.assertUserCanEdit(userSecurityInfo, implementationGuide);

    if (fhirServerVersion !== 'stu3') {        // r4+
      const r4 = <R4ImplementationGuide>implementationGuide;

      r4.definition = r4.definition || {resource: []};
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
      const stu3 = <STU3ImplementationGuide>implementationGuide;

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
  private async removeFromImplementationGuide(fhirServerBase: string, fhirServerVersion: string, structureDefinition: StructureDefinition, implementationGuideId: string, user: ITofUser): Promise<void> {
    const igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', implementationGuideId);
    const igResults = await this.httpService.get<STU3ImplementationGuide | R4ImplementationGuide>(igUrl).toPromise();
    const implementationGuide = igResults.data;

    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);
    this.assertUserCanEdit(userSecurityInfo, implementationGuide);

    if (fhirServerVersion !== 'stu3') {                // r4+
      const r4 = <R4ImplementationGuide>implementationGuide;

      r4.definition = r4.definition || {resource: []};
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
      const stu3 = <STU3ImplementationGuide>implementationGuide;

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

  private async saveStructureDefinition(fhirServerBase: string, fhirServerVersion: string, id: string, structureDefinition: StructureDefinition, user: ITofUser, options?: StructureDefinitionOptions) {
    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);
    this.assertUserCanEdit(userSecurityInfo, structureDefinition);

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
          igUpdatePromises.push(this.addToImplementationGuide(fhirServerBase, fhirServerVersion, updatedStructureDefinition, implementationGuide.id, user));
        } else if (implementationGuide.isRemoved) {
          igUpdatePromises.push(this.removeFromImplementationGuide(fhirServerBase, fhirServerVersion, updatedStructureDefinition, implementationGuide.id, user));
        }
      });
    }

    await Promise.all(igUpdatePromises);

    return updatedStructureDefinition;
  }

  @Post()
  public create(@Req() request: ITofRequest, @Body() body, @User() user: ITofUser) {
    return this.saveStructureDefinition(request.fhirServerBase, request.fhirServerVersion, nanoid(8), body.resource, user, body.options);
  }

  @Put(':id')
  public update(@Req() request: ITofRequest, @Param('id') id: string, @Body() body: SaveStructureDefinitionRequest, @User() user: ITofUser) {
    return this.saveStructureDefinition(request.fhirServerBase, request.fhirServerVersion, id, body.resource, user, body.options);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, id, user);
  }
}
