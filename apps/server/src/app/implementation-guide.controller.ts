import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, LoggerService, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { FhirInstance, FhirServerVersion, RequestHeaders, User } from './server.decorators';
import { ConfigService } from './config.service';
import { BundleExporter } from './export/bundle';
import { copyPermissions } from './helper';
import { ImplementationGuide as STU3ImplementationGuide, PackageResourceComponent } from '@trifolia-fhir/stu3';
import { ImplementationGuide as R4ImplementationGuide } from '@trifolia-fhir/r4';
import type { IBundle, IgExampleModel, IImplementationGuide, IResourceReference, ITofUser } from '@trifolia-fhir/tof-lib';
import {
  BulkUpdateRequest,
  getErrorString,
  getHumanNameDisplay,
  getHumanNamesDisplay,
  getR4Dependencies,
  getSTU3Dependencies,
  PaginateOptions,
  parseReference,
  SearchImplementationGuideResponse,
  SearchImplementationGuideResponseContainer
} from '@trifolia-fhir/tof-lib';
import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import { existsSync } from 'fs';
import { ProjectsService } from './projects/projects.service';
import { AuthService } from './auth/auth.service';
import { FhirResourcesService } from './fhirResources/fhirResources.service';
import {IProjectResource, IExample, IProjectResourceReference, IFhirResource} from '@trifolia-fhir/models';
import { FhirResourcesController } from './fhirResources/fhirResources.controller';
import { ExamplesService } from './examples/examples.service';
import { ImplementationGuide as R5ImplementationGuide, StructureDefinition } from '@trifolia-fhir/r5';
import { forkJoin } from 'rxjs';


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
export class ImplementationGuideController extends FhirResourcesController { // extends BaseFhirController {
  resourceType = 'ImplementationGuide';
  private readonly httpService1: HttpService;

  constructor(protected httpService: HttpService,
    protected configService: ConfigService,
    protected examplesService: ExamplesService,
    protected projectService: ProjectsService,
    protected conformanceService: FhirResourcesService,
    protected authService: AuthService) {

    super(conformanceService);

  }

  public static async downloadDependencies(ig: IImplementationGuide, fhirServerVersion: 'stu3' | 'r4' | 'r5', configService: ConfigService, logger: LoggerService) {
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
          return !existsSync(dependencyDir);
        });

      if (packageIdsForDownload.length === 0) return;

      logger.log(`Executing IG Publisher to download package dependencies for IG ${ig.id}`);

      return new Promise<void>((resolve, reject) => {
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
  public async bulkUpdate(@Param('id') id: string, @Body() body: BulkUpdateRequest, @FhirServerVersion() fhirServerVersion: 'stu3' | 'r4' | 'r5') {
    if (!body) return;

    //update ig
    let conf = <IFhirResource>await this.conformanceService.findById(id);

    if (conf.fhirVersion === 'r4') {
      const igResource = <R4ImplementationGuide>conf.resource;
      if(body.page) {
        igResource.definition.page = body.page;
      }
      if(body.description) {
        igResource.description = body.description;
      }
    }
    if (conf.fhirVersion === 'r5') {
      const igResource = <R5ImplementationGuide>conf.resource;
      if(body.page) {
        igResource.definition.page = body.page;
      }
      if(body.description) {
        igResource.description = body.description;
      }
    } else {
      const igResource = <STU3ImplementationGuide>conf.resource;
      if(body.page) {
        igResource.page = body.page;
      }
      if(body.description) {
        igResource.description = body.description;
      }
    }

    await this.conformanceService.updateConformance(conf.id, conf);

    //update profiles
    for (const profile of (body.profiles || [])) {
      let conf = await this.conformanceService.findOne({ 'resource.resourceType': 'StructureDefinition', 'resource.id': profile.id, 'igIds': id });
      const sdr = <StructureDefinition>conf.resource;
      sdr.description = profile.description;
      sdr.extension = profile.extension ? [...profile.extension] : [];
      if (!sdr.differential) {
        sdr.differential = { extension: [], element: [] };
      }
      sdr.differential.element = profile.diffElement ? [...profile.diffElement] : [];

      await this.conformanceService.updateConformance(conf.id, conf);
    }
  }

  @Get(':id/profile')
  public async getProfiles(@User() user: ITofUser, @Param('id') id: string) {

    const ig = await super.getReferences(user, id);
    let profileReferences: IResourceReference[];

    if (ig.fhirVersion === 'r4') {
      profileReferences = this.getR4ProfileReferences(<R4ImplementationGuide>ig.resource);
    } else if (ig.fhirVersion === 'r3') {
      profileReferences = this.getSTU3ProfileReferences(<STU3ImplementationGuide>ig.resource);
    }

    let profiles = [];

    (ig.references || []).forEach((r: IProjectResourceReference) => {
      if (r.value && typeof r.value === typeof {}) {
        if ('resource' in <any>r.value) {
          if (r.value['resource'].resourceType === 'StructureDefinition') {
            profiles.push(r.value);
          }
        }
      }
    });
    return profiles;

  }


  @Get(':id/example')
  public async getExamples(@Param('id') id: string, @FhirServerVersion() fhirServerVersion: 'stu3' | 'r4'): Promise<IFhirResource[] | IExample[]> {

    let examples = [];

    let igConf = await this.conformanceService.findById(id);
    if (!igConf || igConf.resource.resourceType !== 'ImplementationGuide') {
      throw new BadRequestException();
    }

    // fhir examples for this IG are stored in fhirResources collection
    // find any example references from the IG
    let resourceFilters: { 'resource.resourceType': string, 'resource.id': string }[] = [];

    if (igConf.fhirVersion === 'stu3') {  // STU3 references

      ((<STU3ImplementationGuide>igConf.resource).package || []).forEach(p => {
        p.resource.forEach(r => {
          if (r.example) {
            let ref = (r.sourceReference.reference || '').split('/');
            if (ref && ref.length === 2) {
              resourceFilters.push({ 'resource.resourceType': ref[0], 'resource.id': ref[1] });
            }
          }
        });
      });

    } else {  // R4+ references

      let resources = (<R4ImplementationGuide>igConf.resource).definition?.resource;
      if (resources) {
        resources.forEach(r => {
          if ((r.exampleBoolean || r.exampleCanonical) && r.reference && r.reference.reference) {
            let ref = r.reference.reference.split('/');
            if (ref && ref.length === 2) {
              resourceFilters.push({ 'resource.resourceType': ref[0], 'resource.id': ref[1] });
            }
          }
        });
      }
    }

    // may not have to actually query the fhirResources collection
    if (resourceFilters.length > 0) {
      let filter = {
        $and: [{ 'referencedBy.value': id }, { $or: resourceFilters }]
      }
      let res = await this.conformanceService.findAll(filter);
      examples.push(... res);
    }

    // non-fhir examples for this ig come from the examples collection
    examples.push(... await this.examplesService.findAll({ 'igIds': id }) );

    return examples;
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
            const current = {
              name: 'current',
              'ig-version': 'current',
              package: null,
              'fhir-version': null
            };

            if (guide.editions && guide.editions.length > 0) {
              if (guide.editions[0].package) {
                current.package = guide.editions[0].package.substring(0, guide.editions[0].package.indexOf('#')) + '#current';
              }

              if (guide.editions[0]['fhir-version']) {
                current['fhir-version'] = guide.editions[0]['fhir-version'];
              }
            }

            guides.push({
              name: guide.name,
              canonical: guide.canonical,
              category: guide.category,
              description: guide.description,
              editions: (guide.editions || []).concat([current]),
              'npm-name': guide['npm-name']
            });

          });
        }
        return guides;
      });
  }

  @Get()
  public async searchImplementationGuide(@User() user: ITofUser, @Query() query?: any, @RequestHeaders() headers?): Promise<SearchImplementationGuideResponseContainer> {

    try {

      const searchFilters = {};

      if ('name' in query) {
        searchFilters['ig.name'] = { $regex: query['name'], $options: 'i' };
      }
      if ('title' in query) {
        searchFilters['ig.title'] = { $regex: query['title'], $options: 'i' };
      }
      if ('_id' in query) {
        searchFilters['ig.id'] = { $regex: query['_id'], $options: 'i' };
      }

      const baseFilter = await this.authService.getPermissionFilterBase(user, 'read');

      const filter = {
        $and: [baseFilter, searchFilters]
      };

      const options: PaginateOptions = {
        page: query.page,
        itemsPerPage: 10,
        filter: filter
      };

      options.sortBy = {};
      if ('_sort' in query) {
        options.sortBy[query['_sort']] = 'asc';
      }

      //console.log(`filter: ${JSON.stringify(filter)}`);

      const results = await this.projectService.search(options);

      const searchIGResponses: SearchImplementationGuideResponse[] = [];
      let total = 0;

      if (results && results.results) {
        results.results.forEach(bundle => {
          if (this.configService.server && this.configService.server.publishStatusPath) {
            searchIGResponses.push({
              data: bundle,
              published: false //this.getPublishStatus(bundle.igs[0].id),
            });
          } else {
            searchIGResponses.push({
              data: bundle
            });
          }
        });
        total = results.total;
      }

      return {
        responses: searchIGResponses,
        total: total
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
  public async getImplementationGuide(@User() user, @Param('id') id: string) {
    return super.getById(user, id);
  }

  @Post()
  public async createImplementationGuide(@User() user, @Body() body) {
    if (!body || !body.resource) {
      throw new BadRequestException();
    }
    let conformance: IFhirResource = body;
    ImplementationGuideController.downloadDependencies(body.resource, conformance.fhirVersion, this.configService, this.logger);
    return await this.conformanceService.createConformance(conformance);
  }

  @Put(':id')
  public async updateImplementationGuide(@Param('id') id: string, @Body() body, @User() user) {
    if (!body || !body.resource) {
      throw new BadRequestException();
    }
    await this.assertCanWriteById(user, id);
    let conformance: IFhirResource = body;
    ImplementationGuideController.downloadDependencies(body.resource, conformance.fhirVersion, this.configService, this.logger);
    return await this.conformanceService.updateConformance(id, conformance);
  }

  @Delete(':id')
  public async deleteImplementationGuide(@User() user, @Param('id') id: string) {
    await this.assertCanWriteById(user, id);
    return this.conformanceService.deleteConformance(id);
  }

  @Get(':id/list')
  public async getResourceList(@FhirInstance() fhir, @Param('id') id: string) {
    const exporter = new BundleExporter(this.conformanceService, this.httpService, this.logger, fhir, id);
    const bundle = await exporter.getBundle(false, true);

    return (bundle.entry || []).map((entry) => {
      const resource = <any>entry.resource;
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
  public async copyPermissions(@User() user: ITofUser, @FhirInstance() fhir, @Param('id') id: string): Promise<number> {
    const exporter = new BundleExporter(this.conformanceService, this.httpService, this.logger, fhir, id);
    const bundle = await exporter.getBundle(false, true);
    //const usi = await this.getUserSecurityInfo(user, fhirServerBase);

    const igEntry = (bundle.entry || []).find(e => e.resource.resourceType === 'ImplementationGuide' && e.resource.id === id);

    if (!igEntry) {
      this.logger.error(`No ImplementationGuide entry was found in the bundle returned by the BundleExporter for implementation guide id ${id}`);
      throw new InternalServerErrorException('Could not find the implementation guide requested');
    }

    const ig = <STU3ImplementationGuide | R4ImplementationGuide>igEntry.resource;
    const resources = (bundle.entry || [])
      .filter(e => {
        if (!e.resource || e.resource === ig) return false;
        try {
          //return this.userHasPermission(usi, 'write', e.resource);
          return true;
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
    };

    try {
      //await this.httpService.post(fhirServerBase, updateBundle).toPromise();
    } catch (ex) {
      this.logger.error(`Error updating resources with a copy of permissions from IG ${ig.id}: ${ex.message}`);
      return 0;
    }

    return resources.length;
  }


  @Get(':id/bundle')
  public async getBundle(@User() user: ITofUser, @Param('id') id: string) {
    await this.assertCanReadById(user, id);
    let bundle = await this.conformanceService.getBundleFromImplementationGuideId(id);
    return bundle;
  }


  private getSTU3Examples(implementationGuide: STU3ImplementationGuide) {
    if (!implementationGuide || !implementationGuide.package || implementationGuide.package.length === 0) return [];
    const examples = implementationGuide.package.reduce((theList, p) => {
      const packageExamples = (p.resource || []).filter(r => r.sourceReference && r.sourceReference.reference && (r.example || !!r.exampleFor));
      return theList.concat(packageExamples);
    }, []);

    return examples.map((e: PackageResourceComponent) => {
      const parsedReference = parseReference(e.sourceReference.reference);
      return <IgExampleModel>{
        id: parsedReference.id,
        resourceType: parsedReference.resourceType,
        name: e.name || `${parsedReference.resourceType}: ${parsedReference.id}`
      };
    });
  }

  private getR4Examples(implementationGuide: R4ImplementationGuide) {
    if (!implementationGuide || !implementationGuide.definition || !implementationGuide.definition.resource || implementationGuide.definition.resource.length === 0) return [];

    return implementationGuide.definition.resource
      .filter(r => r.reference && r.reference.reference && (r.exampleBoolean || !!r.exampleCanonical))
      .map(r => {
        const parsedReference = parseReference(r.reference.reference);

        return <IgExampleModel>{
          resourceType: parsedReference.resourceType,
          id: parsedReference.id,
          name: r.name || r.reference.display || `${parsedReference.resourceType}: ${parsedReference.id}`
        };
      });
  }
}
