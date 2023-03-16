import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IConformance } from '@trifolia-fhir/models';
import type { ITofUser, Paginated } from '@trifolia-fhir/tof-lib';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../server.decorators';
import { ConformanceService } from '../providers/conformance.service';
import type { ProjectResourceType } from '../providers/resources.service';
import { ResourcesController } from './resources.controller';

@Controller('api/resources/conformance')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Conformance')
@ApiOAuth2([])
export class ConformanceController extends ResourcesController {

    private resourceType: ProjectResourceType = 'conformance';

    constructor(
        protected readonly conformanceService: ConformanceService,
        protected readonly authService: AuthService
        ) {
        super(conformanceService, authService);
    }

    
    @Get()
    public async search(@User() user: ITofUser, @Query() query: any): Promise<Paginated<IConformance>> {
        return await this.searchResources(user, query, 'conformance');
    }


    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<IConformance> {
        return await this.getResourceById<IConformance>(user, id, this.resourceType);
    }

    @Post()
    public async create(@User() user: ITofUser, @Body() resource: IConformance): Promise<IConformance> {
        return await this.createResource<IConformance>(user, resource, this.resourceType);
    }

    @Put(':id')
    public async update(@User() user: ITofUser, @Param('id') id: string, @Body() resource: IConformance): Promise<IConformance> {
        return await this.updateResource<IConformance>(user, id, resource, this.resourceType);
    }

    @Delete(':id')
    public async delete(@User() user: ITofUser, @Param('id') id: string) {
        this.deleteResource<IConformance>(user, id, this.resourceType);
    }

}
