import { BaseController } from "./base.controller";
import { BaseDataService } from "./base-data.service";
import { BaseEntity } from "./base.entity";
import { Paginated } from "@trifolia-fhir/tof-lib";
import { BadRequestException, Body, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { HydratedDocument } from "mongoose";
import { TofNotFoundException } from "../../not-found-exception";
import { TofLogger } from "../tof-logger";


export class BaseDataController<T extends HydratedDocument<BaseEntity>> extends BaseController {

    protected readonly logger = new TofLogger(BaseDataController.name);

    constructor(
        private dataService: BaseDataService<T>
    ) {
        super();
    }

    @Get() 
    public async search(@Query() query?: any): Promise<Paginated<T>> {         
        this.logger.debug(`search`);
        let options = this.getPaginateOptionsFromQuery(query);
        const res = await this.dataService.search(options);
        return res;
    }


    @Get(':id')
    public async get(@Param('id') id: string): Promise<T> {
        let res = await this.dataService.findById(id);

        if (!res) {
            throw new TofNotFoundException();
        }

        return res;
    }


    @Post()
    public async create(@Body() body: BaseEntity): Promise<T> {
        return this.dataService.create(body);
    }

    @Post()
    public async createMany(@Body() body: BaseEntity[]): Promise<T[]> {
        return this.dataService.createMany(body);
    }
    
    @Put(':id')
    public async update(@Param('id') id: string, @Body() body: BaseEntity): Promise<T> {
        let res = this.dataService.updateOne(id, body);
        return res;
    }

    @Delete(':id')
    public async delete(@Param('id') id: string): Promise<T> {
        // TODO: soft delete
        let res = this.dataService.delete(id);
        return res;
    }


    public assertIdMatch(id: string, entity: BaseEntity): void {
        if (('id' in entity && entity['id'] !== id) || ('_id' in entity && entity['_id'] !== id)) {
            throw new BadRequestException();
        }
    }


    
}