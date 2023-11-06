import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Request, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiTags, ApiOAuth2, ApiOperation} from '@nestjs/swagger';
import type {INonFhirResource} from '@trifolia-fhir/models';
import type {ITofUser} from '@trifolia-fhir/tof-lib';
import {BaseDataController} from '../base/base-data.controller';
import {NonFhirResourcesService} from './non-fhir-resources.service';
import {User} from '../server.decorators';
import {FhirResourcesService} from '../fhir-resources/fhir-resources.service';
import {type NonFhirResourceDocument} from './non-fhir-resource.schema';
import {ObjectId} from 'mongodb';
import {Paginated, PaginateOptions} from '@trifolia-fhir/tof-lib';
import { NonFhirResource} from '@trifolia-fhir/models';
import { AuditEntity } from '../audit/audit.decorator';

@Controller('api/nonFhirResources')
@UseGuards(AuthGuard('bearer'))
@ApiTags('NonFhirResources')
@ApiOAuth2([])
export class NonFhirResourcesController extends BaseDataController<NonFhirResourceDocument> {

  constructor(
    protected readonly nonFhirResourcesService: NonFhirResourcesService,
    protected readonly fhirResourceService: FhirResourcesService
  ) {
    super(nonFhirResourcesService);
  }

  protected getFilterFromRequest(req?: any): {[key: string]: object} {
    let filter = super.getFilterFromRequest(req);

    if (!req) {
      return filter;
    }
    let query = req.query;

    let headers = req.headers;

    if (!query || !headers) {
      return filter;
    }

    if ('type' in query) {
      filter['type'] = query['type'];
    }
    if ('name' in query) {
      filter['name'] = { $regex: this.escapeRegExp(query['name']), $options: 'i' };
    }
    if ('title' in query) {
      filter['title'] = { $regex: this.escapeRegExp(query['title']), $options: 'i' };
    }
    if ('implementationguideid' in query) {
      filter['referencedBy.value'] = new ObjectId(query['implementationguideid']);
    }

    return filter;
  }

  protected getPaginateOptionsFromRequest(req?: any): PaginateOptions {

    let query = req.query;

    const options: PaginateOptions = {
      page: (query && query.page) ? query.page : 1,
      itemsPerPage: (query && query.itemsPerPage) ? query.itemsPerPage : 10,
      sortBy: {},
      pipeline: [{$match: this.getFilterFromRequest(req)}]
    };

    if ('_sort' in query) {

      const sortTerms = query['_sort'].split(',');
      sortTerms.forEach(term => {
        if (!term) return;

        let dir: 'asc' | 'desc' = 'asc';
        if (term[0] === '-') {
          dir = 'desc';
          term = term.substring(1);
        }

        switch (term) {
          case 'name':
            term = 'name';
            break;
          case 'title':
            term = 'title';
            break;
          case 'type':
            term = 'Type';
            break;
        }

        options.sortBy[term] = dir;
      });

    }

    return options;
  }


  @Get(':type/:name/([\$])check-name')
  @HttpCode(200)
  @ApiOperation({ summary: 'checkName', description: 'checkName', operationId: 'check-name' })
  async checkUniqueName(@Param('type') type: string, @Param('name') name: string, @Query('implementationguideid') implementationGuideId?: string): Promise<boolean> {

    let filter = {};
    filter['type'] = type;
    filter['name'] = { $regex: `^${this.escapeRegExp(name)}$`, $options: 'i' };
    if (implementationGuideId) {
      filter['referencedBy.value'] = new ObjectId(implementationGuideId);
    }
    const res= <NonFhirResource>await this.nonFhirResourcesService.findOne(filter);
    // resource found
    if ( res && !!res.id)  {
      return false;
    }
    return true;
  }

  @Get(':type/:name')
  @HttpCode(200)
  @ApiOperation({ summary: 'getByName', description: 'getByName' })
  async getByName(@Param('type') type: string, @Param('name') name: string, @Query('implementationguideid') implementationGuideId?: string): Promise<NonFhirResource> {

    let filter = {};
    filter['type'] = type;
    filter['name'] = { $regex: `^${this.escapeRegExp(name)}$`, $options: 'i' };
    if (implementationGuideId) {
      filter['referencedBy.value'] = new ObjectId(implementationGuideId);
    }
    const res = <NonFhirResource>await this.nonFhirResourcesService.findOne(filter);
    // resource found
    return res;
  }

  @Get(':type')
  @HttpCode(200)
  @ApiOperation({ summary: 'getByType', description: 'getByType' })
  async getByType(@Param('type') type: string, @Query('implementationguideid') implementationGuideId?: string): Promise<NonFhirResource> {

    let filter = {};
    filter['type'] = type;
    if (implementationGuideId) {
      filter['referencedBy.value'] = new ObjectId(implementationGuideId);
    }
    const res = <NonFhirResource>await this.nonFhirResourcesService.findOne(filter);
    // resource found
    return res;
  }


  @Get()
  public async searchNonFhirResource(@User() user: ITofUser, @Request() req): Promise<Paginated<INonFhirResource>> {
    let options = this.getPaginateOptionsFromRequest(req);
    let filter = await this.authService.getPermissionFilterBase(user, 'read');

    options.pipeline = [...options.pipeline, ...filter];
    options.projection = JSON.parse(req.query['_projection']);

    return await this.nonFhirResourcesService.search(options);
  }

  @Post()
  @AuditEntity('create', 'NonFhirResource')
  public async createNonFhirResource(@User() user: ITofUser, @Body() nonFhirResource: NonFhirResourceDocument, @Query('implementationguideid') implementationGuideId?: string): Promise<INonFhirResource> {
    // console.log('POST -- checking perms on IG:', implementationGuideId);
    if (implementationGuideId) {
      if (!await this.authService.userCanWriteFhirResource(user, implementationGuideId)) {
        throw new UnauthorizedException();
      }
      // await this.assertCanWriteById(user, implementationGuideId);
    }
    return await this.nonFhirResourcesService.create(nonFhirResource, implementationGuideId);
  }

  @Put(':id')
  @AuditEntity('update', 'NonFhirResource')
  public async updateNonFhirResource(@User() user: ITofUser, @Param('id') id: string, @Body() nonFhirResource: NonFhirResourceDocument, @Query('implementationguideid') implementationGuideId?: string): Promise<INonFhirResource> {
    console.log('PUT -- checking perms on IG:', implementationGuideId);
    await this.assertIdMatch(id, nonFhirResource);
    await this.assertCanWriteById(user, id);
    if (implementationGuideId) {
      if (!await this.authService.userCanWriteFhirResource(user, implementationGuideId)) {
        throw new UnauthorizedException();
      }
      // await this.assertCanWriteById(user, implementationGuideId);
    }
    return await this.nonFhirResourcesService.updateOne(id, nonFhirResource, implementationGuideId);
  }

  @Delete(':id')
  @AuditEntity('delete', 'NonFhirResource')
  public async deleteNonFhirResource(@User() user: ITofUser, @Param('id') id: string) {
    await this.nonFhirResourcesService.delete(id);
  }

  @Delete(':type/:name')
  async deleteByName(@Param('type') type: string, @Param('name') name: string, @Query('implementationguideid') implementationGuideId?: string):  Promise<INonFhirResource> {
    let filter = { 'type': type, 'name': name};
    if (implementationGuideId) {
      filter['referencedBy.value'] = new ObjectId(implementationGuideId);
    }
    const res = <NonFhirResource>await this.nonFhirResourcesService.findOne(filter);
    return await this.nonFhirResourcesService.delete(res.id);
  }

}
