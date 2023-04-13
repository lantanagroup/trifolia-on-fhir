import {BaseController} from './base.controller';
import {HttpService} from '@nestjs/axios';
import {
  BadRequestException, Body,
  Controller,
  Get,
  Headers,
  Param, Post, Query,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {ConfigService} from './config.service';
import {TofLogger} from './tof-logger';
import {FhirController} from './fhir.controller';
import {FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {TofNotFoundException} from '../not-found-exception';
import {AxiosRequestConfig} from 'axios';
import type {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';
import {
  ValueSet, ValueSetComposeComponent,
  ValueSetConceptReferenceComponent,
  ValueSetConceptSetComponent
} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {addToImplementationGuide} from './helper';
import {IBundle} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Controller('api/import')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Import')
@ApiOAuth2([])
export class ImportController extends BaseController {
  readonly vsacBaseUrl = 'https://cts.nlm.nih.gov/fhir/';
  readonly logger = new TofLogger(ImportController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }

  /**
   * Checks on the status of each of the resources specified in the post to determine if
   * it exists (update), doesn't exist (add) or has an authorization issue for the currently logged in user.
   * @param resourceReferences {string[]} A list of resource references to check on the FHIR server for
   * @param fhirServerBase The FHIR server's base URL that is currently in context
   * @param user The current user to determine authorization on each of the referenced resources
   */
  /*@Post('resourcesStatus')
  public async checkResourcesStatus(@Body() resourceReferences: string[], @FhirServerBase() fhirServerBase: string, @User() user: ITofUser) {
    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);
    const requestBundle = {
      resourceType: 'Bundle',
      type: 'transaction',
      entry: resourceReferences.map(rr => {
        return {
          request: {
            method: 'GET',
            url: rr
          }
        };
      })
    };

    const results = await this.httpService.post<IBundle>(fhirServerBase, requestBundle).toPromise();
    const response: { [resourceReference: string]: string } = {};

    results.data.entry.forEach((e, i) => {
      const resourceReference = requestBundle.entry[i].request.url;

      if (e.resource) {
        response[resourceReference] = 'update';
        // if (this.userHasPermission(userSecurityInfo, 'write', e.resource)) {
        //   response[resourceReference] = 'update';
        // } else {
        //   response[resourceReference] = 'unauthorized';
        // }
      } else if (e.response && e.response.status && e.response.status.startsWith('404')) {
        response[resourceReference] = 'add';
      } else {
        response[resourceReference] = 'unknown';
      }
    });

    return response;
  }
*/
 /* @Post('phinvads')
  public async importPhinVadsValueSet(@Body() importContent: string, @FhirServerBase() fhirServerBase: string, @FhirServerVersion() fhirServerVersion: string, @User() user: ITofUser, @RequestHeaders('implementationGuideId') contextImplementationGuideId) {
    const allLines = importContent.split('\n');
    const headerData = allLines[1].split('\t');
    const name = headerData[0];
    const oid = headerData[2];
    const conceptLines = allLines.slice(4);
    const contextImplementationGuide = await this.getImplementationGuide(fhirServerBase, contextImplementationGuideId);
    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);

    const valueSet = new ValueSet();
    valueSet.id = oid;
    valueSet.url = `urn:oid:${oid}`;
    valueSet.name = name;
    valueSet.compose = new ValueSetComposeComponent();
    valueSet.compose.include = [];

    if (contextImplementationGuide) {
      // TODO: Determine a better URL
    }

    // Find distinct/unique code systems
    const codeSystems = [];

    conceptLines.forEach((line) => {
      const lineData = line.split('\t');
      const codeSystemOid = lineData[4];

      if (!codeSystemOid) {
        return;
      }

      const foundInclude = valueSet.compose.include.find((include) => include.system === `urn:oid:${codeSystemOid}`);

      if (!foundInclude) {
        const newInclude = new ValueSetConceptSetComponent();
        newInclude.system = `urn:oid:${codeSystemOid}`;
        valueSet.compose.include.push(newInclude);
      }
    });

    valueSet.compose.include.forEach((include) => {
      include.concept = conceptLines
        .filter(line => {
          const lineData = line.split('\t');
          const system = `urn:oid:${lineData[4]}`;
          return system === include.system;
        })
        .map(line => {
          const lineData = line.split('\t');
          const concept = new ValueSetConceptReferenceComponent();
          concept.code = lineData[0];
          concept.display = lineData[1];
          return concept;
        });
    });

    const url = buildUrl(fhirServerBase, 'ValueSet', valueSet.id);
    const results = await this.httpService.put(url, valueSet).toPromise();

    if (contextImplementationGuide) {
      await addToImplementationGuide(this.httpService, this.configService, fhirServerBase, fhirServerVersion, valueSet, userSecurityInfo, contextImplementationGuide, true);
    }

    return results.data;
  }*/

  /*@Get('vsac/:id')
  public async importVsacValueSet(
    @FhirServerBase() fhirServerBase: string,
    @FhirServerVersion() fhirServerVersion,
    @User() user: ITofUser,
    @Headers('vsacauthorization') vsacAuthorization: string,
    @Param('id') id: string,
    @Param('applyContextPermissions') applyContextPermissions = true,
    @RequestHeaders('implementationGuideId') contextImplementationGuideId) {

    const contextImplementationGuide = await this.getImplementationGuide(fhirServerBase, contextImplementationGuideId);
    const userSecurityInfo = await this.getUserSecurityInfo(user, fhirServerBase);

    if (!vsacAuthorization) {
      throw new BadRequestException('Expected vsacauthorization header to be provided');
    }

    const options: AxiosRequestConfig = {
      method: 'GET',
      url: buildUrl(this.vsacBaseUrl, 'ValueSet', id),
      headers: {
        'Authorization': vsacAuthorization,
        'Accept': 'application/json'
      }
    };

    let vsacResults;

    try {
      vsacResults = await this.httpService.request(options).toPromise();
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        throw new TofNotFoundException(`The value set ${id} was not found in VSAC`);
      } else if (ex.response && ex.response.status === 401) {
        throw new UnauthorizedException(`The username/password provided were not accepted by VSAC`);
      }

      this.logger.error(`An error occurred while retrieving value set ${id} from VSAC: ${ex.message}`, ex.stack);
      throw ex;
    }

    if (!vsacResults.data || ['ValueSet','CodeSystem'].indexOf(vsacResults.data.resourceType) < 0) {
      throw new BadRequestException('Expected VSAC to return a ValueSet or CodeSystem');
    }

    try {
      const proxyUrl = `/${vsacResults.data.resourceType}/${vsacResults.data.id}`;
      const fhirProxy = new FhirController(this.httpService, this.configService);
      const proxyResults = await fhirProxy.proxy(proxyUrl, null, 'PUT', fhirServerBase, fhirServerVersion, user, vsacResults.data, applyContextPermissions);
      if (contextImplementationGuide) {
        await addToImplementationGuide(this.httpService, this.configService, fhirServerBase, fhirServerVersion, proxyResults.data, userSecurityInfo, contextImplementationGuide, true);
      }
      return proxyResults.data;
    } catch (ex) {
      this.logger.error(`An error occurred while importing value set ${id} from VSAC: ${ex.message}`, ex.stack);
      throw ex;
    }
  }*/
}
