import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, InternalServerErrorException, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {FhirInstance, FhirServerBase, FhirServerId, FhirServerVersion, RequestHeaders, User} from './server.decorators';
import {ConfigService} from './config.service';
import {BundleExporter} from './export/bundle';
import {getHumanNameDisplay, getHumanNamesDisplay} from '../../../../libs/tof-lib/src/lib/helper';
import {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';
import {copyPermissions} from './helper';
import {ImplementationGuide as STU3ImplementationGuide} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {FhirController} from './fhir.controller';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';

@Controller('api/implementationGuide')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Implementation Guide')
@ApiOAuth2Auth()
export class ImplementationGuideController extends BaseFhirController {
  resourceType = 'ImplementationGuide';

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
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
            if (guide.editions) {
              guide.editions.forEach((edition) => {
                guides.push({
                  name: guide.name,
                  url: edition.url,
                  version: edition['ig-version'],
                  'npm-name': guide['npm-name']
                });
              });
            }
          });
        }

        return guides;
      })
  }

  @Get()
  public search(@User() user: ITofUser, @FhirServerBase() fhirServerBase: string, @Query() query?: any, @RequestHeaders() headers?) {
    return super.baseSearch(user, fhirServerBase, query, headers);
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
