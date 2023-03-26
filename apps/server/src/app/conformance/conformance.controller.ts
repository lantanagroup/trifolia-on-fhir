import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IConformance } from '@trifolia-fhir/models';
import type { ITofUser, Paginated } from '@trifolia-fhir/tof-lib';
import { User } from '../server.decorators';
import { ConformanceService } from './conformance.service';
import { BaseDataController } from '../base/base-data.controller';
import { ConformanceDocument } from './conformance.schema';

@Controller('api/conformance')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Conformance')
@ApiOAuth2([])
export class ConformanceController extends BaseDataController<ConformanceDocument> {

    constructor(
        protected readonly conformanceService: ConformanceService
    ) {
        super(conformanceService);
    }


    protected getFilterFromQuery(query?: any): any {
        let filter = super.getFilterFromQuery(query);

        if (!query) {
            return filter;
        }
        if ('resource.resourceType' in query) {
            filter['resource.resourceType'] = { $regex: query['resource.resourceType'], $options: 'i' };
        }
        return filter;
    }


    @Get()
    public async searchConformance(@User() user: ITofUser, @Query() query: any): Promise<Paginated<IConformance>> {
        let options = this.getPaginateOptionsFromQuery(query);
        let baseFilter = this.authService.getPermissionFilterBase(user, 'read');

        options.filter = {
            $and: [
                options.filter,
                baseFilter
            ]
        };

        return await this.conformanceService.search(options);
    }

    @Get(':id/references')
    public async getWithReferences(@User() user: ITofUser, @Param('id') id: string): Promise<any> {
      await this.assertCanReadById(user, id);
      return await this.conformanceService.findAll({_id: new Object(id)}, ["references.value"]);
    }

    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<IConformance> {
        await this.assertCanReadById(user, id);
        return this.conformanceService.findById(id);
    }

    @Post()
    public async createConformance(@User() user: ITofUser, @Body() conformance: IConformance): Promise<IConformance> {
        return await this.conformanceService.createConformance(conformance);
    }

    @Put(':id')
    public async updateConformance(@User() user: ITofUser, @Param('id') id: string, @Body() conformance: IConformance): Promise<IConformance> {
        await this.assertIdMatch(id, conformance);
        await this.assertCanWriteById(user, id);
        return await this.conformanceService.updateConformance(id, conformance);
    }

    @Delete(':id')
    public async deleteConformance(@User() user: ITofUser, @Param('id') id: string) {
        await this.assertCanWriteById(user, id);
        this.conformanceService.delete(id);
    }

}
