import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IExample } from '@trifolia-fhir/models';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { BaseDataController } from '../base/base-data.controller';
import { ExamplesService } from './examples.service';
import { ExampleDocument } from './example.schema';
import { User } from '../server.decorators';

@Controller('api/examples')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Examples')
@ApiOAuth2([])
export class ExamplesController extends BaseDataController<ExampleDocument> {

    constructor(
        protected readonly examplesService: ExamplesService
        ) {
        super(examplesService);
    }


    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<IExample> {
        return await this.examplesService.findById(id);
    }

    @Post()
    public async createExample(@User() user: ITofUser, @Body() example: IExample, @Query('implementationguideid') implementationGuideId?: string): Promise<IExample> {
        return await this.examplesService.createExample(example, implementationGuideId);
    }

    @Put(':id')
    public async updateExample(@User() user: ITofUser, @Param('id') id: string, @Body() example: IExample, @Query('implementationguideid') implementationGuideId?: string): Promise<IExample> {
        return await this.examplesService.updateExample(id, example, implementationGuideId);
    }

    @Delete(':id')
    public async deleteExample(@User() user: ITofUser, @Param('id') id: string) {
        this.examplesService.delete(id);
    }

}