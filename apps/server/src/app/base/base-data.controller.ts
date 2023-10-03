import { BaseController } from "./base.controller";
import { Paginated } from "@trifolia-fhir/tof-lib";
import { BadRequestException, Body, Delete, Get, Inject, Param, Post, Put, Request, UnauthorizedException } from "@nestjs/common";
import { TofNotFoundException } from "../../not-found-exception";
import { TofLogger } from "../tof-logger";
import { User } from "../server.decorators";
import { AuthService } from "../auth/auth.service";
import { IBaseDataService } from "./interfaces";
import type { IBaseEntity } from "@trifolia-fhir/models";


export class BaseDataController<T extends IBaseEntity> extends BaseController {

    protected readonly logger = new TofLogger(BaseDataController.name);

    @Inject(AuthService)
    protected authService: AuthService;

    constructor(
        protected dataService: IBaseDataService<T>
    ) {
        super();
    }


    public async assertCanReadById(@User() user, id: string) {
        if (!await this.authService.userCanByService(user, id, this.dataService, 'read')) {
            throw new UnauthorizedException();
        }
    }

    public async assertCanWriteById(@User() user, id: string) {
        if (!await this.authService.userCanByService(user, id, this.dataService, 'write')) {
            throw new UnauthorizedException();
        }
    }

    public assertIdMatch(id: string, entity: IBaseEntity): void {
        if (('id' in entity && entity['id'] !== id) || ('_id' in entity && entity['_id'] !== id)) {
            throw new BadRequestException();
        }
    }

    

    @Get() 
    public async search(@Request() req?: any): Promise<Paginated<T>> {         
        //this.logger.debug(`search`);
        let options = this.getPaginateOptionsFromRequest(req);
        const res = await this.dataService.search(options);
        return res;
    }
    

    @Get(':id')
    public async get(@Param('id') id: string): Promise<T> {
        //console.log('in controller get:', id);
        let res = await this.dataService.findById(id);

        if (!res) {
            throw new TofNotFoundException();
        }

        return res;
    }


    @Post()
    public async create(@Body() body: IBaseEntity): Promise<T> {
        return this.dataService.create(body);
    }

    @Post()
    public async createMany(@Body() body: IBaseEntity[]): Promise<T[]> {
        return this.dataService.createMany(body);
    }
    
    @Put(':id')
    public async update(@Param('id') id: string, @Body() body: IBaseEntity): Promise<T> {
        let res = this.dataService.updateOne(id, body);
        return res;
    }

    @Delete(':id')
    public async delete(@Param('id') id: string): Promise<T> {
        // TODO: soft delete
        let res = this.dataService.delete(id);
        return res;
    }


    


    
}