import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, InternalServerErrorException, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirInstance, FhirServerBase, FhirServerId, FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {BundleExporter} from './export/bundle';
import {getErrorString, getHumanNameDisplay, getHumanNamesDisplay, parseReference} from '../../../../libs/tof-lib/src/lib/helper';
import {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';
import {copyPermissions} from './helper';
import {ImplementationGuide as STU3ImplementationGuide, PackageResourceComponent} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide, ImplementationGuide as R4ImplementationGuide} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {SearchImplementationGuideResponse, SearchImplementationGuideResponseContainer} from '../../../../libs/tof-lib/src/lib/searchIGResponse-model';
import {AxiosRequestConfig} from 'axios';
import {IImplementationGuide} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {IgExampleModel} from '../../../../libs/tof-lib/src/lib/ig-example-model';

@Controller('api/implementationGuide')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Implementation Guide')
@ApiOAuth2Auth()
export class ImplementationGuideController extends BaseFhirController {
  resourceType = 'ImplementationGuide';

  constructor(protected httpService: HttpService,
              protected configService: ConfigService) {
    super(httpService, configService);
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
      throw new InvalidModuleConfigException('Server is not configured with a publishedGuides property');
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
    return super.baseCreate(fhirServerBase, fhirServerVersion, body, user);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion, @Param('id') id: string, @Body() body, @User() user) {
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
        return this.userHasPermission(usi, 'write', e.resource);
      })
      .map(e => e.resource);

    const updated = resources
      .map(r => {
        copyPermissions(ig, r);
        const url = buildUrl(fhirServerBase, r.resourceType, r.id);
        return this.httpService.put(url, r).toPromise();
      });

    await Promise.all(updated);

    return updated.length;
  }
}
