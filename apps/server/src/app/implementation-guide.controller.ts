import { BaseFhirController } from './base-fhir.controller';
import { Body, Controller, Delete, Get, HttpService, InternalServerErrorException, LoggerService, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { FhirInstance, FhirServerBase, FhirServerId, FhirServerVersion, RequestHeaders, User } from './server.decorators';
import { ConfigService } from './config.service';
import { BundleExporter } from './export/bundle';
import { getErrorString, getHumanNameDisplay, getHumanNamesDisplay, parseReference } from '../../../../libs/tof-lib/src/lib/helper';
import { ITofUser } from '../../../../libs/tof-lib/src/lib/tof-user';
import { copyPermissions } from './helper';
import { ImplementationGuide as STU3ImplementationGuide, PackageResourceComponent } from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Bundle, ImplementationGuide as R4ImplementationGuide } from '../../../../libs/tof-lib/src/lib/r4/fhir';
import { buildUrl, getR4Dependencies, getSTU3Dependencies } from '../../../../libs/tof-lib/src/lib/fhirHelper';
import { SearchImplementationGuideResponse, SearchImplementationGuideResponseContainer } from '../../../../libs/tof-lib/src/lib/searchIGResponse-model';
import { AxiosRequestConfig } from 'axios';
import { IBundle, IImplementationGuide, IResourceReference } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { IgExampleModel } from '../../../../libs/tof-lib/src/lib/ig-example-model';
import { spawn } from 'child_process';
import { BulkUpdateRequest } from '../../../../libs/tof-lib/src/lib/bulk-update-request';
import path from 'path';
import os from 'os';
import * as fs from 'fs';

class PatchRequest {
  op: string;
  path: string;
  value: any;

  constructor(op: string, path: string, value: any) {
    this.op = op;
    this.path = path;
    this.value = value;
  }
}

@Controller('api/implementationGuide')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Implementation Guide')
@ApiOAuth2([])
export class ImplementationGuideController extends BaseFhirController {
  resourceType = 'ImplementationGuide';

  constructor(protected httpService: HttpService,
              protected configService: ConfigService) {
    super(httpService, configService);
  }

  public static async downloadDependencies(ig: IImplementationGuide, fhirServerVersion: 'stu3'|'r4', configService: ConfigService, logger: LoggerService) {
    try {
      const igPublisherLocation = await configService.getIgPublisherForDependencies();

      let packageIds: string[];

      if (fhirServerVersion === 'r4') {
        packageIds = getR4Dependencies(<R4ImplementationGuide>ig);
      } else if (fhirServerVersion === 'stu3') {
        packageIds = getSTU3Dependencies(<STU3ImplementationGuide>ig);
      }

      // Only run the IG Publisher if there is something to do
      const packageIdsForDownload = packageIds
        .filter(packageId => {
          const dependencyDir = path.join(os.homedir(), '.fhir', 'packages', packageId, 'package');
          return !fs.existsSync(dependencyDir);
        });

      if (packageIdsForDownload.length === 0) return;

      logger.log(`Executing IG Publisher to download package dependencies for IG ${ig.id}`);

      return new Promise((resolve, reject) => {
        const dependencyProcess = spawn('java', ['-jar', igPublisherLocation, '-package', packageIdsForDownload.join(';')]);

        dependencyProcess.stdout.on('data', (data) => {
          const ignoreLines = [
            'Detected Java version',
            'dir = ',
            'Cache = '
          ];

          const foundIgnoreLine = ignoreLines.find(il => data.toString().toLowerCase().startsWith(il.toLowerCase()));

          if (!foundIgnoreLine) {
            logger.log(data.toString().trim());
          }
        });
        dependencyProcess.stderr.on('data', (data) => {
          logger.error(data.toString().trim());
        });
        dependencyProcess.on('error', (err) => {
          logger.error(`Error downloading dependencies using IG Publisher: ${err.toString().trim()}`);
          reject();
        });
        dependencyProcess.on('exit', () => {
          resolve();
        });
      });
    } catch (ex) {
      console.error(`Error preparing to download dependencies: ${ex.message}`);
    }
  }

  private getR4ProfileReferences(ig: R4ImplementationGuide): IResourceReference[] {
    if (!ig || !ig.definition || !ig.definition.resource) return [];
    return ig.definition.resource
      .filter(r => r.reference && r.reference.reference)
      .filter(r => {
        const parsedReference = parseReference(r.reference.reference);
        return parsedReference.resourceType === 'StructureDefinition';
      })
      .map(r => r.reference);
  }

  private getSTU3ProfileReferences(ig: STU3ImplementationGuide): IResourceReference[] {
    if (!ig || !ig.package) return [];
    const profileReferences = [];

    ig.package.forEach(p => {
      (p.resource || [])
        .filter(r => r.sourceReference && r.sourceReference.reference)
        .forEach(r => {
          const parsedReference = parseReference(r.sourceReference.reference);

          if (parsedReference.resourceType === 'StructureDefinition') {
            profileReferences.push(r.sourceReference);
          }
        });
    });

    return profileReferences;
  }

  @Post(':id/bulk-update')
  public async bulkUpdate(@Param('id') id: string, @Body() body: BulkUpdateRequest, @FhirServerBase() fhirServerBase: string, @FhirServerVersion() fhirServerVersion: 'stu3'|'r4') {
    if (!body) return;

    const patchRequests: AxiosRequestConfig[] = [];

    if (body.description || body.page) {
      const igPatchRequests: PatchRequest[] = [];

      if (body.descriptionOp) {
        igPatchRequests.push(new PatchRequest(body.descriptionOp, '/description', body.description));
      }

      if (body.pageOp) {
        if (fhirServerVersion === 'stu3') {
          igPatchRequests.push(new PatchRequest(body.pageOp, '/page', body.page));
        } else if (fhirServerVersion === 'r4') {
          igPatchRequests.push(new PatchRequest(body.pageOp, '/definition/page', body.page));
        }
      }

      patchRequests.push({
        method: 'PATCH',
        url: buildUrl(fhirServerBase, 'ImplementationGuide', id),
        headers: {
          'Content-Type': 'application/json-patch+json'
        },
        data: igPatchRequests
      });
    }

    (body.profiles || []).forEach(profile => {
      const profilePatchRequests: PatchRequest[] = [];

      if (profile.descriptionOp) {
        profilePatchRequests.push(new PatchRequest(profile.descriptionOp, '/description', profile.description));
      }

      if (profile.extensionOp) {
        profilePatchRequests.push(new PatchRequest(profile.extensionOp, '/extension', profile.extension));
      }

      if (profile.diffElementOp) {
        profilePatchRequests.push(new PatchRequest(profile.diffElementOp, '/differential/element', profile.diffElement));
      }

      patchRequests.push({
        method: 'PATCH',
        url: buildUrl(fhirServerBase, 'StructureDefinition', profile.id),
        headers: {
          'Content-Type': 'application/json-patch+json'
        },
        data: profilePatchRequests
      });
    });

    const processQueue = async () => {
      if (patchRequests.length === 0) return;
      const asyncCount = 5;

      const nextPatchRequests = patchRequests.splice(0, asyncCount - 1);
      const nextPromises = nextPatchRequests
        .map(patchRequest => this.httpService.request(patchRequest).toPromise());

      const results = await Promise.all(nextPromises);
      console.log(results);
      await processQueue();
    };

    try {
      await processQueue();
      this.logger.log(`Done bulk-updating implementation guide ${id}`);
    } catch (ex) {
      this.logger.error(`Error while bulk updating: ${ex.message}`);
      throw ex;
    }
  }

  @Get(':id/profile')
  public async getProfiles(@Param('id') id: string, @FhirServerBase() fhirServerBase: string, @FhirServerVersion() fhirServerVersion: 'stu3'|'r4') {
    const igUrl = buildUrl(fhirServerBase, 'ImplementationGuide', id);
    const igResults = await this.httpService.get<IImplementationGuide>(igUrl).toPromise();
    const ig = igResults.data;
    let profileReferences: IResourceReference[];

    if (fhirServerVersion === 'r4') {
      profileReferences = this.getR4ProfileReferences(<R4ImplementationGuide> ig);
    } else {
      profileReferences = this.getSTU3ProfileReferences(<STU3ImplementationGuide> ig);
    }

    const batch = <Bundle> {
      resourceType: 'Bundle',
      type: 'batch',
      entry: profileReferences.map(pr => {
        return {
          request: {
            method: 'GET',
            url: pr.reference
          }
        };
      })
    };

    const bundleResults = await this.httpService.post<IBundle>(fhirServerBase, batch).toPromise();
    return bundleResults.data;
  }

  @Get(':id/example')
  public async getExamples(@Param('id') id: string, @FhirServerBase() fhirServerBase: string, @FhirServerVersion() fhirServerVersion: 'stu3'|'r4') {
    const implementationGuideUrl = buildUrl(fhirServerBase, 'ImplementationGuide', id);
    const implementationGuideResponse = await this.httpService.get<IImplementationGuide>(implementationGuideUrl).toPromise();
    const implementationGuide = implementationGuideResponse.data;

    switch (fhirServerVersion) {
      case 'stu3':
        return this.getSTU3Examples(<STU3ImplementationGuide> implementationGuide);
      case 'r4':
        return this.getR4Examples(<R4ImplementationGuide> implementationGuide);
      default:
        this.logger.error(`Unexpected FHIR server version ${fhirServerVersion} when requesting IG examples`);
        throw new InternalServerErrorException();
    }
  }

  @Get('published')
  public getPublishedGuides(): Promise<any> {
    if (!this.configService.fhir.publishedGuides) {
      throw new Error('Server is not configured with a publishedGuides property');
    }

    return this.httpService.get(this.configService.fhir.publishedGuides).toPromise()
      .then((results) => {
        const guides = [];

        if (results.data && results.data.guides) {
          results.data.guides.forEach((guide) => {
            guides.push({
              name: guide.name,
              canonical: guide.canonical,
              category: guide.category,
              description: guide.description,
              editions: guide.editions,
              'npm-name': guide['npm-name']
            });

          });
        }
        return guides;
      })
  }

  @Get()
  public async search(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Query() query?: any, @RequestHeaders() headers?): Promise<SearchImplementationGuideResponseContainer> {
    const preparedQuery = await this.prepareSearchQuery(user, fhirServerBase, query, headers);

    const options = <AxiosRequestConfig> {
      url: buildUrl(fhirServerBase, this.resourceType, null, null, preparedQuery),
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    };

    try {
      const results = await this.httpService.request(options).toPromise();
      const searchIGResponses: SearchImplementationGuideResponse[] = [];

      if (results.data && results.data.entry) {
        results.data.entry.forEach(bundle => {
          if (this.configService.server && this.configService.server.publishStatusPath) {
            searchIGResponses.push({
              data: bundle,
              published: this.getPublishStatus(bundle.resource.id),
            });
          } else {
            searchIGResponses.push({
              data: bundle
            });
          }
        });
      }

      return {
        responses: searchIGResponses,
        total: results.data.total
      };
    } catch (ex) {
      let message = `Failed to search for resource type ${this.resourceType}: ${ex.message}`;

      if (ex.response && ex.response.data && ex.response.data.resourceType === 'OperationOutcome') {
        message = getErrorString(null, ex.response.data);
        this.logger.error(message, ex.stack);
        throw new InternalServerErrorException(message);
      }

      this.logger.error(message, ex.stack);
      throw ex;
    }
  }

  @Get(':id')
  public get(@FhirServerBase() fhirServerBase: string, @Query() query, @User() user, @Param('id') id: string) {
    return super.baseGet(fhirServerBase, id, query, user);
  }

  @Post()
  public create(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @User() user, @Body() body) {
    ImplementationGuideController.downloadDependencies(body, fhirServerVersion, this.configService, this.logger);
    return super.baseCreate(fhirServerBase, fhirServerVersion, body, user);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user) {
    ImplementationGuideController.downloadDependencies(body, fhirServerVersion, this.configService, this.logger);
    return super.baseUpdate(fhirServerBase, fhirServerVersion, id, body, user);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase: string, @FhirServerVersion() fhirServerVersion: 'stu3'|'r4', @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, fhirServerVersion, id, user);
  }

  @Get(':id/list')
  public async getResourceList(@FhirServerBase() fhirServerBase: string, @FhirServerId() fhirServerId: string, @FhirServerVersion() fhirServerVersion: string, @FhirInstance() fhir, @Param('id') id: string) {
    const exporter = new BundleExporter(this.httpService, this.logger, fhirServerBase, fhirServerId, fhirServerVersion, fhir, id);
    const bundle = await exporter.getBundle(false, true);

    return (bundle.entry || []).map((entry) => {
      const resource = <any> entry.resource;
      const ret = {
        resourceType: resource.resourceType,
        id: resource.id,
        display: resource.title || resource.name
      };

      if (ret.display instanceof Array) {
        ret.display = getHumanNamesDisplay(ret.display);
      } else if (typeof ret.display === 'object') {
        ret.display = getHumanNameDisplay(ret.display);
      }

      return ret;
    });
  }

  @Post(':id/copy-permissions')
  public async copyPermissions(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @FhirServerId() fhirServerId: string, @FhirServerVersion() fhirServerVersion: string, @FhirInstance() fhir, @Param('id') id: string): Promise<number> {
    const exporter = new BundleExporter(this.httpService, this.logger, fhirServerBase, fhirServerId, fhirServerVersion, fhir, id);
    const bundle = await exporter.getBundle(false, true);
    const usi = await this.getUserSecurityInfo(user, fhirServerBase);

    const igEntry = (bundle.entry || []).find(e => e.resource.resourceType === 'ImplementationGuide' && e.resource.id === id);

    if (!igEntry) {
      this.logger.error(`No ImplementationGuide entry was found in the bundle returned by the BundleExporter for implementation guide id ${id}`);
      throw new InternalServerErrorException('Could not find the implementation guide requested');
    }

    const ig = <STU3ImplementationGuide | R4ImplementationGuide> igEntry.resource;
    const resources = (bundle.entry || [])
      .filter(e => {
        if (!e.resource || e.resource === ig) return false;
        try {
          return this.userHasPermission(usi, 'write', e.resource);
        } catch (ex) {
          this.logger.error(`Error determining if user has permission to resource ${e.resource.resourceType}/${e.resource.id}: ${ex.message}`);
        }
      })
      .map(e => e.resource);

    const updateBundle: IBundle = {
      resourceType: 'Bundle',
      type: 'batch',
      entry: resources.map(r => {
        copyPermissions(ig, r);

        return {
          request: {
            method: 'PUT',
            url: `${r.resourceType}/${r.id}`
          },
          resource: r
        };
      })
    }

    try {
      await this.httpService.post(fhirServerBase, updateBundle).toPromise();
    } catch (ex) {
      this.logger.error(`Error updating resources with a copy of permissions from IG ${ig.id}: ${ex.message}`);
      return 0;
    }

    return resources.length;
  }

  private getSTU3Examples(implementationGuide: STU3ImplementationGuide) {
    if (!implementationGuide || !implementationGuide.package || implementationGuide.package.length === 0) return [];
    const examples = implementationGuide.package.reduce((theList, p) => {
      const packageExamples = (p.resource || []).filter(r => r.sourceReference && r.sourceReference.reference && (r.example || !!r.exampleFor));
      return theList.concat(packageExamples);
    }, []);

    return examples.map((e: PackageResourceComponent) => {
      const parsedReference = parseReference(e.sourceReference.reference);
      return <IgExampleModel> {
        id: parsedReference.id,
        resourceType: parsedReference.resourceType,
        name: e.name || `${parsedReference.resourceType}: ${parsedReference.id}`
      }
    });
  }

  private getR4Examples(implementationGuide: R4ImplementationGuide) {
    if (!implementationGuide || !implementationGuide.definition || !implementationGuide.definition.resource || implementationGuide.definition.resource.length === 0) return [];

    return implementationGuide.definition.resource
      .filter(r => r.reference && r.reference.reference && (r.exampleBoolean || !!r.exampleCanonical))
      .map(r => {
        const parsedReference = parseReference(r.reference.reference);

        return <IgExampleModel> {
          resourceType: parsedReference.resourceType,
          id: parsedReference.id,
          name: r.name || r.reference.display || `${parsedReference.resourceType}: ${parsedReference.id}`
        };
      });
  }
}
