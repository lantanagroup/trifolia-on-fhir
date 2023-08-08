import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiTags, ApiOAuth2} from '@nestjs/swagger';
import type {INonFhirResource} from '@trifolia-fhir/models';
import type {ITofUser} from '@trifolia-fhir/tof-lib';
import {BaseDataController} from '../base/base-data.controller';
import {NonFhirResourcesService} from './non-fhir-resources.service';
import {User} from '../server.decorators';
import {FhirResourcesService} from '../fhirResources/fhirResources.service';
import {type NonFhirResourceDocument} from './non-fhir-resource.schema';
import {ObjectId} from 'mongodb';
import {Paginated, PaginateOptions} from '@trifolia-fhir/tof-lib';
import {IFhirResource} from '@trifolia-fhir/models';

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

  protected getFilterFromRequest(req?: any): any {
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
      filter['name'] = { $regex: query['name'], $options: 'i' };
    }
    if ('title' in query) {
      filter['title'] = { $regex: query['title'], $options: 'i' };
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
      filter: this.getFilterFromRequest(req)
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


  @Get()
  public async searchFhirResource(@User() user: ITofUser, @Request() req): Promise<Paginated<INonFhirResource>> {
    let options = this.getPaginateOptionsFromRequest(req);
    let baseFilter = this.authService.getPermissionFilterBase(user, 'read');

    options.filter = {
      $and: [
        options.filter,
        baseFilter
      ]
    };

    return await this.nonFhirResourcesService.search(options);
  }

  @Post()
  public async createNonFhirResource(@User() user: ITofUser, @Body() nonFhirResource: NonFhirResourceDocument, @Query('implementationguideid') implementationGuideId?: string): Promise<INonFhirResource> {
    console.log('POST -- checking perms on IG:', implementationGuideId);
    if (implementationGuideId) {
      if (!await this.authService.userCanWriteFhirResource(user, implementationGuideId)) {
        throw new UnauthorizedException();
      }
      // await this.assertCanWriteById(user, implementationGuideId);
    }
    return await this.nonFhirResourcesService.create(nonFhirResource, implementationGuideId);
  }

  @Put(':id')
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
  public async deleteNonFhirResource(@User() user: ITofUser, @Param('id') id: string) {
    await this.nonFhirResourcesService.delete(id);
  }

}
