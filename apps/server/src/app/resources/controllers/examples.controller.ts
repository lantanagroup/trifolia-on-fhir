import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IExample } from '@trifolia-fhir/models';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../server.decorators';
import { ExamplesService } from '../providers/examples.service';
import type { ProjectResourceType } from '../providers/resources.service';
import { ResourcesController } from './resources.controller';

@Controller('api/resources/examples')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Examples')
@ApiOAuth2([])
export class ExamplesController extends ResourcesController {

    private resourceType: ProjectResourceType = 'example';

    constructor(
        protected readonly examplesService: ExamplesService,
        protected readonly authService: AuthService
        ) {
        super(examplesService, authService);
    }


    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<IExample> {
        return await this.getResourceById<IExample>(user, id, this.resourceType);
    }

    @Post()
    public async create(@User() user: ITofUser, @Body() resource: IExample): Promise<IExample> {
        return await this.createResource<IExample>(user, resource, this.resourceType);
    }

    @Put(':id')
    public async update(@User() user: ITofUser, @Param('id') id: string, @Body() resource: IExample): Promise<IExample> {
        return await this.updateResource<IExample>(user, id, resource, this.resourceType);
    }

    @Delete(':id')
    public async delete(@User() user: ITofUser, @Param('id') id: string) {
        this.deleteResource<IExample>(user, id, this.resourceType);
    }

}
