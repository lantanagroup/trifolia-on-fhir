import {BaseFhirController} from './base-fhir.controller';
import {HttpService} from '@nestjs/axios';
import {Body, Controller, Delete, Headers, Get, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {FhirController} from './fhir.controller';
import type {ITofRequest} from './models/tof-request';
import {StructureDefinition} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthGuard} from '@nestjs/passport';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {StructureDefinition as PCStructureDefinition} from 'fhir/model/structure-definition';
import {SnapshotGenerator} from 'fhir/snapshotGenerator';
import {FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {getErrorString} from '../../../../libs/tof-lib/src/lib/helper';
import {Fhir} from 'fhir/fhir';
import {BaseDefinitionResponseModel} from '../../../../libs/tof-lib/src/lib/base-definition-response-model';
import {IStructureDefinition} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import * as fs from 'fs';
import * as path from 'path';
import {ILogicalTypeDefinition} from '../../../../libs/tof-lib/src/lib/logical-type-definition';
import {ITypeConfig} from '../../../../libs/tof-lib/src/lib/type-config';
import {ConformanceController} from './conformance/conformance.controller';
import {AuthService} from './auth/auth.service';
import {ConformanceService} from './conformance/conformance.service';
import {Paginated, PaginateOptions} from '@trifolia-fhir/tof-lib';
import {IConformance} from '@trifolia-fhir/models';


@Controller('api/structureDefinition')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Structure Definition')
@ApiOAuth2([])
export class StructureDefinitionController extends ConformanceController  {
  resourceType = 'StructureDefinition';

  private fhirController;
  constructor(protected authService: AuthService,  protected httpService: HttpService, protected conformanceService: ConformanceService, protected configService: ConfigService) {

    super(conformanceService);
    this.fhirController = new FhirController(authService, this.httpService, this.conformanceService, this.configService);
  }


  /**
   * Gets all possible base definitions for the given type
   * @param request
   * @param type
   */
  @Get('base/:type')
  public async getBaseStructureDefinitions(@User() user,  @Req() request: ITofRequest, @Param('type') type: string): Promise<string[]> {

    const results = await super.searchConformance(user, request);
    const ret = (results.results  || []).map((entry) => {
      const structureDefinition = <StructureDefinition> entry.resource;
      return structureDefinition.url;
    });

    // Add the base definition from the spec for the type
    ret.splice(0, 0, `http://hl7.org/fhir/StructureDefinition/${type}`);

    return ret;
  }

  private async getBaseStructureDefinitionResource(@User() user, @Req() request: ITofRequest, url: string) {
    try {
      const results = await super.searchConformance(user, request);

      if (results && results.total === 1) {
        return <IStructureDefinition> results[0].resource;
      }
    } catch (ex) {
      this.logger.error(`Error while retrieving base structure definition ${url}: ${ex.message}`);
    }
  }

  @Get('type')
  public async getSupportedLogicalTypes(@Query('search') search: string, @FhirServerVersion() fhirServerVersion: string) {
    const typesConfigPath = path.join(__dirname, 'config/types.json');
    if (!fs.existsSync(typesConfigPath)) return [];

    const typesConfigContent = fs.readFileSync(typesConfigPath).toString();
    const typesConfig = <ITypeConfig[]> JSON.parse(typesConfigContent);

    let supportedLogicalTypes = [];

   if(fhirServerVersion === 'r4') {
     supportedLogicalTypes = ["FHIR-R4", "CDA-R2.1"];
   }else if(fhirServerVersion === 'stu3') {
     supportedLogicalTypes = ["FHIR-STU3"];
   }
    const allTypes = supportedLogicalTypes
      .map(slt => typesConfig.find(tc => tc.id.toLowerCase() === slt.toLowerCase()))
      .reduce<ILogicalTypeDefinition[]>((previous, current) => {
        if (current && current.types) {
          previous.push(...current.types);
        }
        return previous;
      }, []);

    const filtered = allTypes
      .filter(slt => search ? JSON.stringify(slt).toLowerCase().includes(search.toLowerCase()) : true);

    return filtered.slice(0, 10);
  }

  /**
   * Gets the base structure definition specified by the url.
   * Ensures that the structure definition returned has a snapshot.
   * @param request {ITofRequest} The express request object
   * @param url {string} The url of the base profile to return
   * @param type {string}
   */
  @Get('base')
  public async getBaseStructureDefinition(@User() user, @Req() request: ITofRequest, @Query('url') url: string, @Query('type') type: string, @RequestHeaders("implementationGuideId") implementationGuideId: string,
                                          @FhirServerVersion() fhirServerVersion: 'stu3'|'r4'): Promise<BaseDefinitionResponseModel> {
    const ret = new BaseDefinitionResponseModel();

    if (!url.startsWith('http://hl7.org/fhir/StructureDefinition/')) {
      try {
        const dependencies = await this.fhirController.searchDependency(implementationGuideId, fhirServerVersion, 'StructureDefinition',
          null, null, null, null, null, url, false);

        // if length === 1 then just return
        if (dependencies.entry.length === 1) {
          ret.base = dependencies.entry[0].resource['resource'];
          return ret;
        }
        let profileWithSnapshot: IStructureDefinition = await this.getBaseStructureDefinitionResource(user, request, url);

        // The snapshot is not already generated for the profile, so we need to generate it now.
        if (!profileWithSnapshot.snapshot) {
            profileWithSnapshot = await this.generateInternalSnapshot( user, request, request.fhir, url);

        }

        if (profileWithSnapshot && profileWithSnapshot.resourceType === 'StructureDefinition' && profileWithSnapshot.snapshot) {
          ret.base = profileWithSnapshot;
          return ret;
        }
      } catch (ex) {
        ret.message = ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome' ? getErrorString(null, ex.response.data) : ex.message;
        ret.success = false;
        this.logger.error(`Error while getting snapshot for base profile: ${ret.message}`);
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
  public async searchStructureDefinition(@User() user, @Req() req?: any): Promise<Paginated<IConformance>> {
    return super.searchConformance(user, req);

  }

  @Get(':id')
  public async getStructureDefinition(@User() user, @Param('id') id: string): Promise<IConformance> {
    return super.getById(user, id);
  }

  @Post()
  public createStructureDefinition(@User() user, @Body() body, @RequestHeaders('implementationGuideId') contextImplementationGuideId) {
    let conformance: IConformance = body;
    return this.conformanceService.createConformance(conformance, contextImplementationGuideId);
  }

  @Put(':id')
  public async updateStructureDefinition(@User() user, @Param('id') id: string, @Body() body) {
    await this.assertCanWriteById(user, id);
    let conformance: IConformance = body;
    return this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public async deleteStructureDefinition(@User() user, @Param('id') id: string ) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }

  /**
   * Collects all profiles related to the url specified and Uses the FHIR.js generateSnapshot() functionality to create a snapshot.
   * @param fhirServerBase
   * @param fhir
   * @param url
   */
  private async generateInternalSnapshot(@User() user, @Req() request, fhir: Fhir, url: string) {
    // Recursive function to get all base profiles for a given url
    const getNextBase = async (baseUrl: string, list: StructureDefinition[] = []) => {
      const foundBaseProfile = fhir.parser.structureDefinitions.find((sd) => sd.url === baseUrl);
      if (foundBaseProfile) {
        list.push(foundBaseProfile);
      } else {

        const searchFilters = {};
        searchFilters['resource.resourceType'] = { $regex: 'StructureDefinition', $options: 'i' };
        searchFilters['url'] = { $regex: url, $options: 'i' };
        const baseFilter =  this.authService.getPermissionFilterBase(user, 'read');
        const filter = {
          $and: [ baseFilter, searchFilters]
        };

        const options: PaginateOptions = {
          page: 1,
          itemsPerPage: 10,
          filter: filter
        };
        const results =  await this.conformanceService.search(options);

        const base = <StructureDefinition>results.results[0].resource;

        list.push(base);
        await getNextBase(base.baseDefinition, list);
      }

      return list;
    };

    let baseProfiles;

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
   * @deprecated This is no longer used, but may be used in future, so it is preserved.
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
        body.snapshot = results.data.snapshot;
        return body;
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
