import { BaseController } from './base.controller';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException, Body,
  Controller,
  Get,
  Headers,
  Param,
  Post, Query,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { TofLogger } from './tof-logger';
import { RequestHeaders, User } from './server.decorators';
import type { ITofUser } from '../../../../libs/tof-lib/src/lib/tof-user';
import { FhirResourcesService } from './fhirResources/fhirResources.service';
import { NonFhirResourcesService } from './non-fhir-resources/non-fhir-resources.service';
import { ObjectId } from 'mongodb';
import { IProjectResource } from '@trifolia-fhir/models';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { buildUrl } from '@trifolia-fhir/tof-lib';
import { FhirResource } from './fhirResources/fhirResource.schema';
import { TofNotFoundException } from '../not-found-exception';

@Controller('api/import')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Import')
@ApiOAuth2([])
export class ImportController extends BaseController {
  readonly vsacBaseUrl = 'https://cts.nlm.nih.gov/fhir/';
  readonly logger = new TofLogger(ImportController.name);

  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    protected fhirResourceService: FhirResourcesService,
    protected nonFhirResourcesService: NonFhirResourcesService) {
    super(configService, httpService);
  }

  /**
   * Checks on the status of each of the resources specified in the post to determine if
   * it exists (update), doesn't exist (add) or has an authorization issue for the currently logged in user.
   * @param resourceReferences A list of resource references to check
   * @param user The current user to determine authorization on each of the referenced resources
   */
  @Post('resourcesStatus')
  public async checkResourcesStatus(
    @Body() resourceReferences: { resourceType: string, id: string, isExample: boolean }[],
    @User() user: ITofUser, @Query('implementationguideid') implementationGuideId?: string)
    : Promise<{ [resourceReference: string]: { resource?: IProjectResource, action: 'update' | 'add' | 'unknown' } }> {

    if (!resourceReferences || !resourceReferences.length || resourceReferences.length < 1) {
      throw new BadRequestException();
    }


    const response: { [resourceReference: string]: { resource?: IProjectResource, action: 'update' | 'add' | 'unknown' } } = {};

    for (const e of resourceReferences) {

      let res: IProjectResource;
      let path = `${e.resourceType}/${e.id}`;

      let filter = {};
      if (implementationGuideId && "ImplementationGuide" !== e.resourceType) {
        filter['referencedBy.value'] = new ObjectId(implementationGuideId);
      }

      if (e.isExample) {
        filter['$or'] = [
          {'content.resourceType': e.resourceType, 'content.id': e.id},
          {'name': e.id, 'content': {$type: 'string'}}
        ];

        res = await this.nonFhirResourcesService.findOne(filter);
      } else {
        filter['resource.resourceType'] = e.resourceType;
        filter['resource.id'] = e.id;

        res = await this.fhirResourceService.findOne(filter);
      }

      // resource found
      if (res && !!res.id) {
        response[path] = { resource: res, action: 'update' };
      } else {
        response[path] = { resource: null, action: 'add' };
      }

    }

    return response;
  }

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

  @Get('vsac/:id')
  public async importVsacValueSet(
    @User() user: ITofUser,
    @Headers('vsacauthorization') vsacAuthorization: string,
    @Param('id') id: string,
    @Param('applyContextPermissions') applyContextPermissions = true,
    @RequestHeaders('implementationGuideId') contextImplementationGuideId) {

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
      vsacResults = await firstValueFrom(this.httpService.request(options));
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        throw new TofNotFoundException(`The value set ${id} was not found in VSAC`);
      } else if (ex.response && ex.response.status === 401) {
        throw new UnauthorizedException('The API key provided was not accepted by VSAC');
      }

      this.logger.error(`An error occurred while retrieving value set ${id} from VSAC: ${ex.message}`, ex.stack);
      throw ex;
    }

    if (!vsacResults.data || ['ValueSet','CodeSystem'].indexOf(vsacResults.data.resourceType) < 0) {
      throw new BadRequestException('Expected VSAC to return a ValueSet or CodeSystem');
    }

    try {
      const newRes = new FhirResource();
      newRes.resource = vsacResults.data;
      return await this.fhirResourceService.createFhirResource(newRes, contextImplementationGuideId);
    } catch (ex) {
      this.logger.error(`An error occurred while importing value set ${id} from VSAC: ${ex.message}`, ex.stack);
      throw ex;
    }
  }
}
