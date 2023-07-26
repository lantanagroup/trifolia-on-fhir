import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IFhirResource, IExample, IProjectResourceReference, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import type { ITofUser, PaginateOptions, Paginated } from '@trifolia-fhir/tof-lib';
import { RequestHeaders, User } from '../server.decorators';
import { FhirResourcesService } from './fhirResources.service';
import { BaseDataController } from '../base/base-data.controller';
import {FhirResourceDocument } from './fhirResource.schema';
import { TofNotFoundException } from '../../not-found-exception';
import { ObjectId } from 'mongodb';
import { TofLogger } from '../tof-logger';

@Controller('api/fhirResources')
@UseGuards(AuthGuard('bearer'))
@ApiTags('FhirResource')
@ApiOAuth2([])
export class FhirResourcesController extends BaseDataController<FhirResourceDocument> {
    protected resourceType: string
    protected readonly logger = new TofLogger(FhirResourcesController.name);

    constructor(
        protected readonly fhirResourceService: FhirResourcesService
    ) {
        super(fhirResourceService);
    }


    protected assertResourceValid(fhirResource: IFhirResource) {
        if (!fhirResource || (this.resourceType && fhirResource.resource.resourceType !== this.resourceType)) {
            throw new TofNotFoundException(`No valid resource of type ${this.resourceType} found`);
        }
    }


    protected getFilterFromRequest(req?: any): any {
        let filter = super.getFilterFromRequest(req);

        if (!req) {
            return filter;
        }
        let query = req.query;

        let headers = req.headers;

        if (!query || !headers ) {
            return filter;
        }
        if ('fhirversion' in query) {
            filter['fhirVersion'] = query['fhirversion'];
        }
        if ('resourcetype' in query) {
            filter['resource.resourceType'] = query['resourcetype'];
        }
        if ('name' in query) {
            filter['resource.name'] = { $regex: query['name'], $options: 'i' };
        }
        if ('title' in query) {
            filter['resource.title'] = { $regex: query['title'], $options: 'i' };
        }
        if ('resourceid' in query) {
            filter['resource.id'] = { $regex: query['resourceid'], $options: 'i' };
        }
        if ('type' in query) {
            filter['resource.type'] = { $regex: query['type'], $options: 'i' };
        }
        if ('url' in query) {
            filter['resource.url'] = { $regex: query['url'], $options: 'i' };
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
                        term = 'resource.name';
                        break;
                    case 'title':
                        term = 'resource.title';
                        break;
                    case 'resourceid':
                        term = 'resource.id';
                        break;
                    case 'resourcetype':
                        term = 'resource.resourceType';
                        break;
                }

                options.sortBy[term] = dir;
            });

        }

        return options;
    }



    @Get('empty')
    public async getEmpty(): Promise<IFhirResource> {
        return await this.fhirResourceService.getEmpty();
    }


    @Get()
    public async searchFhirResource(@User() user: ITofUser, @Request() req): Promise<Paginated<IFhirResource>> {
        let options = this.getPaginateOptionsFromRequest(req);
        let baseFilter = this.authService.getPermissionFilterBase(user, 'read');

        options.filter = {
            $and: [
                options.filter,
                baseFilter
            ]
        };

        return await this.fhirResourceService.search(options);
    }

    @Get(':id/references')
    public async getReferences(@User() user: ITofUser, @Param('id') id: string): Promise<any> {
        await this.assertCanReadById(user, id);
        return await this.fhirResourceService.getWithReferences(id);
    }

    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<IFhirResource> {
        await this.assertCanReadById(user, id);
        let fhirResource = await this.fhirResourceService.findById(id);
        this.assertResourceValid(fhirResource);
        return fhirResource;
    }

    @Post()
    public async createFhirResource(@User() user: ITofUser, @Body() fhirResource: IFhirResource, @Query('implementationguideid') implementationGuideId?: string, @Query('isexample') isExample?: boolean): Promise<IFhirResource> {
        if (implementationGuideId) {
            await this.assertCanWriteById(user, implementationGuideId);
        }
        return await this.fhirResourceService.createFhirResource(fhirResource, implementationGuideId, isExample);
    }

    @Put(':id')
    public async updateFhirResource(@User() user: ITofUser, @Param('id') id: string, @Body() fhirResource: IFhirResource, @Query('implementationguideid') implementationGuideId?: string, @Query('isexample') isExample?: boolean): Promise<IFhirResource> {
        await this.assertIdMatch(id, fhirResource);
        await this.assertCanWriteById(user, id);
        if (implementationGuideId) {
            await this.assertCanWriteById(user, implementationGuideId);
        }
        return await this.fhirResourceService.updateFhirResource(id, fhirResource, implementationGuideId, isExample);
    }

    @Delete(':id')
    public async deleteFhirResource(@User() user: ITofUser, @Param('id') id: string) {
        await this.assertCanWriteById(user, id);
        this.fhirResourceService.delete(id);
    }


    @Get(':id/reference-map')
    public async getReferenceMap(@User() user: ITofUser, @Param('id') id: string): Promise<IProjectResourceReferenceMap> {
        await this.assertCanReadById(user, id);

        let fhirResource = await this.fhirResourceService.getModel().findById(id).populate("references.value");
        this.assertResourceValid(fhirResource);
        return this.fhirResourceService.getReferenceMap(fhirResource);
    }

}
