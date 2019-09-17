import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {Bundle, StructureDefinition} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthGuard} from '@nestjs/passport';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {StructureDefinition as PCStructureDefinition} from 'fhir/parseConformance';
import {SnapshotGenerator} from 'fhir/snapshotGenerator';
import {FhirServerBase, FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';

@Controller('api/structureDefinition')
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
   * @param request {ITofRequest} The express request object
   * @param url {string} The url of the base profile to return
   * @param type {string}
   */
  @Get('base')
  public async getBaseStructureDefinition(@Req() request: ITofRequest, @Query('url') url: string, @Query('type') type: string) {
    // Recursive function to get all base profiles for a given url
    const getNextBase = async (baseUrl: string, list: StructureDefinition[] = []) => {
      const foundBaseProfile = request.fhir.parser.structureDefinitions.find((sd) => sd.url === baseUrl);
      if (foundBaseProfile) {
        list.push(foundBaseProfile);
      } else {
        const requestUrl = buildUrl(request.fhirServerBase, 'StructureDefinition', null, null, {url: baseUrl});
        const results = await this.httpService.get<Bundle>(requestUrl).toPromise();

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
      // Extra logic in case one of the base profiles aren't present... Should at least respond with a snapshot based on the core spec
      if (!type) {
        throw new Error(`Can't find one or more base profiles for ${url} and no type is specified to fall back on`);
      }

      const baseUrl = 'http://hl7.org/fhir/StructureDefinition/' + type;
      const baseTypeProfile = request.fhir.parser.structureDefinitions.find((sd) => sd.url === baseUrl);

      if (!baseTypeProfile) {
        throw new Error(`Can't find base profile for ${baseUrl}`);
      }

      return baseTypeProfile;
    }

    const found = baseProfiles.find((baseProfile) => baseProfile.url === url);

    if (!found.snapshot) {
      const baseProfilesBundle = SnapshotGenerator.createBundle(...(<PCStructureDefinition[]>baseProfiles));
      request.fhir.generateSnapshot(baseProfilesBundle);
    }

    return found;
  }

  @Get()
  public search(@User() user, @FhirServerBase() fhirServerBase?: string, @Query() query?: any, @RequestHeaders() headers?): Promise<any> {
    return super.baseSearch(user, fhirServerBase, query, headers);
  }

  @Get(':id')
  public get(@FhirServerBase() fhirServerBase, @Query() query, @User() user, @Param('id') id: string) {
    return super.baseGet(fhirServerBase, id, query, user);
  }

  @Post()
  public create(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId) {
    return super.baseCreate(fhirServerBase, fhirServerVersion, body, user, contextImplementationGuideId);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user, @RequestHeaders('implementationGuideId') contextImplementationGuideId) {
    return super.baseUpdate(fhirServerBase, fhirServerVersion, id, body, user, contextImplementationGuideId);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, id, user);
  }
}
