import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IConformance, IExample, IProjectResourceReference, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import type { ITofUser, PaginateOptions, Paginated } from '@trifolia-fhir/tof-lib';
import { RequestHeaders, User } from '../server.decorators';
import { ConformanceService } from './conformance.service';
import { BaseDataController } from '../base/base-data.controller';
import { Conformance, ConformanceDocument } from './conformance.schema';
import { TofNotFoundException } from '../../not-found-exception';
import { ObjectId } from 'mongodb';
import { TofLogger } from '../tof-logger';

@Controller('api/conformance')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Conformance')
@ApiOAuth2([])
export class ConformanceController extends BaseDataController<ConformanceDocument> {
    protected resourceType: string
    protected readonly logger = new TofLogger(ConformanceController.name);

    constructor(
        protected readonly conformanceService: ConformanceService
    ) {
        super(conformanceService);
    }


    protected assertResourceValid(conformance: IConformance) {
        if (!conformance || (this.resourceType && conformance.resource.resourceType !== this.resourceType)) {
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
            filter['igIds'] = new ObjectId(query['implementationguideid']);
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
    public async getEmpty(): Promise<IConformance> {
        return await this.conformanceService.getEmpty();
    }


    @Get()
    public async searchConformance(@User() user: ITofUser, @Request() req): Promise<Paginated<IConformance>> {
        let options = this.getPaginateOptionsFromRequest(req);
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
    public async getReferences(@User() user: ITofUser, @Param('id') id: string): Promise<any> {
        await this.assertCanReadById(user, id);
        return await this.conformanceService.getWithReferences(id);
    }

    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<IConformance> {
        await this.assertCanReadById(user, id);
        let conformance = await this.conformanceService.findById(id);
        this.assertResourceValid(conformance);
        return conformance;
    }

    @Post()
    public async createConformance(@User() user: ITofUser, @Body() conformance: IConformance, @Query('implementationguideid') implementationGuideId?: string): Promise<IConformance> {
        return await this.conformanceService.createConformance(conformance, implementationGuideId);
    }

    @Put(':id')
    public async updateConformance(@User() user: ITofUser, @Param('id') id: string, @Body() conformance: IConformance, @Query('implementationguideid') implementationGuideId?: string): Promise<IConformance> {
        await this.assertIdMatch(id, conformance);
        await this.assertCanWriteById(user, id);
        return await this.conformanceService.updateConformance(id, conformance, implementationGuideId);
    }

    @Delete(':id')
    public async deleteConformance(@User() user: ITofUser, @Param('id') id: string) {
        await this.assertCanWriteById(user, id);
        this.conformanceService.delete(id);
    }


    @Get(':id/reference-map')
    public async getReferenceMap(@User() user: ITofUser, @Param('id') id: string): Promise<IProjectResourceReferenceMap> {
        await this.assertCanReadById(user, id);

        let conformance = await this.conformanceService.getModel().findById(id).populate("references.value");
        this.assertResourceValid(conformance);

        let map: IProjectResourceReferenceMap = {};
        (conformance.references || []).forEach((r: IProjectResourceReference) => {
            if (!r.value || typeof r.value === typeof '') return;

            let key: string;
            if (r.valueType === 'Conformance') {
                const val: IConformance = <IConformance>r.value;
                key = `${val.resource.resourceType}/${val.resource.id ?? val.id}`;
            }
            else if (r.valueType === 'Example') {
                const val: IExample = <IExample>r.value;
                if ('resourceType' in val.content && 'id' in val.content) {
                    key = `${val.content['resourceType']}/${val.content['id'] ?? val.id}`;
                }
                else {
                    key = `example/${val.content['id'] ?? val.id}`;
                }
            }

            if (key) {
                map[key] = r;
            }
        });

        return map;
    }

}
