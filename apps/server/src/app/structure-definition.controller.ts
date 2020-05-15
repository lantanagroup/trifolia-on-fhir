import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {Bundle, StructureDefinition} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthGuard} from '@nestjs/passport';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {StructureDefinition as PCStructureDefinition} from 'fhir/model/structure-definition';
import {SnapshotGenerator} from 'fhir/snapshotGenerator';
import {FhirServerBase, FhirServerId, FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {getErrorString} from '../../../../libs/tof-lib/src/lib/helper';
import {Fhir} from 'fhir/fhir';
import {BaseDefinitionResponseModel} from '../../../../libs/tof-lib/src/lib/base-definition-response-model';
import {IBundle, IStructureDefinition} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';

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

  private async getBaseStructureDefinitionResource(fhirServerBase: string, url: string) {
    try {
      const getUrl = buildUrl(fhirServerBase, 'StructureDefinition', null, null, { url: url });
      const getResults = await this.httpService.get(getUrl).toPromise();
      const bundle = <IBundle> getResults.data;

      if (bundle && bundle.entry && bundle.entry.length === 1) {
        return <IStructureDefinition> bundle.entry[0].resource;
      }
    } catch (ex) {
      this.logger.error(`Error while retrieving base structure definition ${url}: ${ex.message}`);
    }
  }

  /**
   * Gets the base structure definition specified by the url.
   * Ensures that the structure definition returned has a snapshot.
   * @param request {ITofRequest} The express request object
   * @param url {string} The url of the base profile to return
   * @param type {string}
   */
  @Get('base')
  public async getBaseStructureDefinition(@Req() request: ITofRequest, @Query('url') url: string, @Query('type') type: string): Promise<BaseDefinitionResponseModel> {
    const ret = new BaseDefinitionResponseModel();
    const fhirServer = this.configService.fhir.servers.find(s => s.id === request.fhirServerId);

    if (!url.startsWith('http://hl7.org/fhir/StructureDefinition/')) {
      try {
        let profileWithSnapshot: IStructureDefinition = await this.getBaseStructureDefinitionResource(request.fhirServerBase, url);

        // The snapshot is not already generated for the profile, so we need to generate it now.
        if (!profileWithSnapshot.snapshot) {
          if (fhirServer.supportsSnapshot) {
            const snapshotUrl = buildUrl(request.fhirServerBase, 'StructureDefinition', null, '$snapshot', { url: url });
            const results = await this.httpService.get(snapshotUrl).toPromise();
            profileWithSnapshot = results.data;
          } else {
            profileWithSnapshot = await this.generateInternalSnapshot(request.fhirServerBase, request.fhir, url);
          }
        }

        if (profileWithSnapshot && profileWithSnapshot.resourceType === 'StructureDefinition' && profileWithSnapshot.snapshot) {
          ret.base = profileWithSnapshot;
          return ret;
        }
      } catch (ex) {
        ret.message = ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome' ? getErrorString(null, ex.response.data) : ex.message;
        ret.success = false;
      }
    }

    // Extra logic in case one of the base profiles aren't present or snapshot generation fails...
    // Should at least respond with a snapshot based on the core resource type from the spec
    if (!type) {
      ret.success = false;
      ret.message = `Can't find one or more base profiles for ${url} and no type is specified to fall back on`;
      return ret;
    }

    const baseUrl = 'http://hl7.org/fhir/StructureDefinition/' + type;
    const baseTypeProfile = request.fhir.parser.structureDefinitions.find((sd) => sd.url === baseUrl);

    if (!baseTypeProfile) {
      ret.success = false;
      ret.message = `Can't find base profile in spec for ${baseUrl}`;
    } else {
      ret.base = baseTypeProfile;
    }

    return ret;
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
  public async create(@FhirServerBase() fhirServerBase, @FhirServerId() fhirServerId: string, @FhirServerVersion() fhirServerVersion, @User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = true) {
    body = await this.generateProfileSnapshot(fhirServerId, body);
    return super.baseCreate(fhirServerBase, fhirServerVersion, body, user, contextImplementationGuideId, applyContextPermissions);
  }

  @Put(':id')
  public async update(@FhirServerBase() fhirServerBase, @FhirServerId() fhirServerId: string, @FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user, @RequestHeaders('implementationGuideId') contextImplementationGuideId, @Param('applyContextPermissions') applyContextPermissions = false) {
    body = await this.generateProfileSnapshot(fhirServerId, body);
    return super.baseUpdate(fhirServerBase, fhirServerVersion, id, body, user, contextImplementationGuideId, applyContextPermissions);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion: 'stu3'|'r4', @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, fhirServerVersion, id, user);
  }

  /**
   * Collects all profiles related to the url specified and Uses the FHIR.js generateSnapshot() functionality to create a snapshot.
   * @param fhirServerBase
   * @param fhir
   * @param url
   */
  private async generateInternalSnapshot(fhirServerBase: string, fhir: Fhir, url: string) {
    // Recursive function to get all base profiles for a given url
    const getNextBase = async (baseUrl: string, list: StructureDefinition[] = []) => {
      const foundBaseProfile = fhir.parser.structureDefinitions.find((sd) => sd.url === baseUrl);
      if (foundBaseProfile) {
        list.push(foundBaseProfile);
      } else {
        const requestUrl = buildUrl(fhirServerBase, 'StructureDefinition', null, null, {url: baseUrl});
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

    let baseProfiles, baseUrl, baseTypeProfile;

    try {
      baseProfiles = await getNextBase(url);
    } catch (ex) {
      this.logger.warn(`Error while attempting to internally generate a snapshot for the profile ${url}: ${ex.message}`);
      return null;
    }

    const found = baseProfiles.find((baseProfile) => baseProfile.url === url);

    if (!found.snapshot) {
      const baseProfilesBundle = SnapshotGenerator.createBundle(...(<PCStructureDefinition[]>baseProfiles));
      fhir.generateSnapshot(baseProfilesBundle);
    }

    return found;
  }
  /**
   * Generates a snapshot for the specified profile if the FHIR server is configured to support snapshot
   * @param fhirServerId
   * @param body
   */
  private async generateProfileSnapshot(fhirServerId: string, body: any) {
    const fhirServer = this.configService.fhir.servers.find(s => s.id === fhirServerId);
    const fhirServerBase = fhirServer.uri;
    if (!fhirServer.supportsSnapshot) {
      // TODO: add internal snapshot generation logic
      delete body.snapshot;
      return body;
    }

    try {
      const snapshotUrl = buildUrl(fhirServerBase, 'StructureDefinition', null, '$snapshot');
      const results = await this.httpService.post(snapshotUrl, body).toPromise();

      if (results.data && results.data.resourceType === 'StructureDefinition' && results.data.snapshot) {
        return results.data;
      }
    } catch (ex) {
      let msg = ex.message;
      if (ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome') {
        msg = getErrorString(null, ex.response.data);
      }

      this.logger.warn(`Could not generate snapshot during update to StructureDefinition ${body.id || 'new'}: ${msg}`);
    }

    // If snapshot failed to generate, make sure the current profile is not saved with an out-dated snapshot.
    delete body.snapshot;
    return body;
  }
}
