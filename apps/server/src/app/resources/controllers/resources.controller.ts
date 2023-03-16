import { Body, Controller, ForbiddenException, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IProjectResource } from '@trifolia-fhir/models';
import type { ITofUser, Paginated, PaginateOptions } from '@trifolia-fhir/tof-lib';
import { TofNotFoundException } from 'apps/server/src/not-found-exception';
import { AuthService } from '../../auth/auth.service';
import { BaseController } from '../../base/base.controller';
import { User } from '../../server.decorators';
import type { ProjectResourceType } from '../providers/resources.service';
import { ResourcesService } from '../providers/resources.service';

@Controller('api/resources')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Resources')
@ApiOAuth2([])
export class ResourcesController extends BaseController {

    constructor(
        protected readonly resourcesService: ResourcesService,
        protected readonly authService: AuthService
    ) {
        super();
    }


    protected assertUserCanView(@User() user: ITofUser, resourceId: string) {
        if (!this.authService.userCanReadResource(user, resourceId)) {
            throw new ForbiddenException();
        }
    }

    protected assertUserCanWrite(@User() user: ITofUser, resourceId: string) {
        if (!this.authService.userCanWriteResource(user, resourceId)) {
            throw new ForbiddenException();
        }
    }


    protected override getFilterFromQuery(query?: any) {
        
        const searchFilters = {};

        if ('name' in query) {
            searchFilters['resource.name'] = { $regex: query['name'], $options: 'i' };
        }
        if ('title' in query) {
            searchFilters['ig.title'] = { $regex: query['title'], $options: 'i' };
        }
        if ('_id' in query) {
            searchFilters['ig.id'] = { $regex: query['_id'], $options: 'i' };
        }
    }


    public async searchResources<T extends IProjectResource>(@User() user: ITofUser, @Query() query: any, type: ProjectResourceType, options?: PaginateOptions): Promise<Paginated<T>> {

        console.log('searchResources');
        if (!options) {
            options = this.getPaginateOptionsFromQuery(query);
        }
        
        options.filter = { $and: [
            options.filter,
            this.authService.getPermissionFilterBase()
        ] };

        return <Paginated<T>>(await this.resourcesService.search(options, type));
    }


    public async getResourceById<T extends IProjectResource>(@User() user: ITofUser, @Param('id') id: string, resourceType: ProjectResourceType): Promise<T> {
        this.assertUserCanView(user, id);

        let res = await this.resourcesService.findById(id, [], resourceType);

        if (!res) {
            throw new TofNotFoundException(`No ${resourceType} found for ${id}`);
        }
        return <T>res;
    }
    
    public async createResource<T extends IProjectResource>(@User() user: ITofUser, @Body() resource: IProjectResource, resourceType: ProjectResourceType): Promise<T> {
        return <T>(await this.resourcesService.create(resource, resourceType));
    }

    
    public async updateResource<T extends IProjectResource>(@User() user: ITofUser, @Param('id') id: string, @Body() resource: IProjectResource, resourceType: ProjectResourceType): Promise<T> {
        this.assertUserCanWrite(user, id);
        return <T>(await this.resourcesService.updateOne(id, resource, resourceType));
    }

    public async deleteResource<T extends IProjectResource>(@User() user: ITofUser, @Param('id') id: string, resourceType: ProjectResourceType) {
        this.assertUserCanWrite(user, id);
        return this.resourcesService.delete(id, resourceType);
    }

    

}
