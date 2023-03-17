import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { IConformance, IHistory, IProject, IProjectResource } from '@trifolia-fhir/models';
import { IDomainResource, Paginated, PaginateOptions } from '@trifolia-fhir/tof-lib';
import { Document } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { AuthService } from '../../auth/auth.service';
import { BaseEntity } from '../../base/base.entity';
import type { IBaseDataService } from '../../base/interfaces';
import { TofLogger } from '../../tof-logger';
import { Conformance, ConformanceDocument, ConformanceSchema } from '../schemas/conformance.schema';
import { Example, ExampleDocument } from '../schemas/example.schema';
import { History, HistoryDocument } from '../schemas/history.schema';


export type ProjectResourceType = 'conformance' | 'example' | 'history';


@Injectable()
export class ResourcesService implements IBaseDataService {

    protected readonly logger = new TofLogger(ResourcesService.name);

    constructor(
        @InjectModel(Conformance.name) protected conformanceModel: Model<ConformanceDocument>,
        @InjectModel(Example.name) protected exampleModel: Model<ExampleDocument>,
        @InjectModel(History.name) protected historyModel: Model<HistoryDocument>
    ) { }


    public getModelForType(type: ProjectResourceType = 'conformance'): Model<HydratedDocument<IProjectResource>> {
        if (type === 'conformance') {
            return this.conformanceModel;
        }
        if (type === 'example') {
            return this.exampleModel;
        }
        if (type === 'history') {
            return this.historyModel;
        }
        throw new InternalServerErrorException(`Unhandled resource type ${type}`);
    }


    public async collectionCount(type?: ProjectResourceType): Promise<number> {
        return this.getModelForType(type).estimatedDocumentCount().exec();
    }

    public async count(filter = {}, type?: ProjectResourceType): Promise<number> {
        return this.getModelForType(type).countDocuments(filter).exec();
    }

    public async findAll(filter = {}, populate = [], type?: ProjectResourceType): Promise<IProjectResource[]> {
        return this.getModelForType(type).find(filter).populate(populate).exec();
    }

    public async findOne(filter = {}, populate = [], type?: ProjectResourceType): Promise<IProjectResource> {
        return this.getModelForType(type).findOne(filter).populate(populate).exec();
    }

    public async findById(id: string, populate = [], type?: ProjectResourceType): Promise<IProjectResource> {
        return this.getModelForType(type).findById(id).populate(populate).exec();
    }


    public async create(newDoc: IProjectResource, type?: ProjectResourceType): Promise<IProjectResource> {

        const lastUpdated = new Date();
        let versionId = 1;

        delete newDoc.id;
        delete newDoc['_id'];

        if (type === 'conformance') {

            let newConf = <IConformance>newDoc;

            // validate FHIR resource
            // TODO: actually use FHIR validator
            if (!(newConf.resource && newConf.resource instanceof Object) ) {
                throw new BadRequestException(`Invalid conformance resource provided.`);
            }

            // ensure meta version ID and lastUpdated are set
            if (!newConf.resource.meta) {
                newConf.resource.meta = {};
            }
            newConf.resource.meta.versionId = versionId;
            newConf.resource.meta.lastUpdated = lastUpdated;

            newConf = await this.conformanceModel.create(newConf);

            let newHistory: IHistory = {
                content: newConf.resource,
                versionId: versionId,
                lastUpdated: lastUpdated,
                targetId: newConf.id,
                type: 'conformance'
            }


            await this.historyModel.create(newHistory);

            return newConf;
        }


        // TODO: handle example creation

        throw new BadRequestException("Invalid resource type specified.");

    }

    public async createMany(newDocs: IProjectResource[], type?: ProjectResourceType): Promise<IProjectResource[]> {
        let res: IProjectResource[] = [];
        for await (const newDoc of newDocs) {
            res.push(await this.create(newDoc, type));
        }
        return res;
    }


    public async updateOne(id: string, updatedDoc: IProjectResource, type?: ProjectResourceType): Promise<IProjectResource> {

        const lastUpdated = new Date();
        let versionId: number;

        if (updatedDoc.id && updatedDoc.id !== id) {
            throw new BadRequestException();
        }


        // conformance resource type
        if (type === 'conformance') {

            let existing = await this.conformanceModel.findById(id);
            if (!existing) {
                throw new NotFoundException();
            }

            // most likely isn't empty, but...
            if (!existing.resource) {
                existing.resource = <IDomainResource>{};
            }

            let upConf = <IConformance>updatedDoc;

            // validate FHIR resource
            // TODO: actually use FHIR validator
            if (!(upConf.resource && upConf.resource instanceof Object) ) {
                throw new BadRequestException(`Invalid conformance resource provided.`);
            }


            for (let key in upConf) {
                existing[key] = upConf[key];
            }


            // ensure we have a resource metadata object
            if (!existing.resource.meta) {
                existing.resource.meta = {};
            }

            // default to using existing version+1 if present
            if (existing.versionId) {
                versionId = existing.versionId + 1;
            }
            // otherwise check resource meta
            else if (existing.resource.meta.versionId) {
                versionId = existing.resource.meta.versionId + 1;
            }
            else {
                versionId = 1;
            }

            existing.resource.meta.versionId = versionId;
            existing.resource.meta.lastUpdated = lastUpdated;
            existing.versionId = versionId;
            existing.lastUpdated = lastUpdated;

            await existing.save();

            let newHistory: IHistory = {
                content: existing.resource,
                versionId: versionId,
                lastUpdated: lastUpdated,
                targetId: existing.id,
                type: 'conformance'
            }

            await this.historyModel.create(newHistory);

            return existing;
        }


        // TODO: handle example update

        throw new BadRequestException("Invalid resource type specified.");
    }

    public async delete(id: string, type?: ProjectResourceType): Promise<IProjectResource> {
        // TODO: soft delete resource
       return this.getModelForType(type).findByIdAndRemove(id);
    }


    public async search(options: PaginateOptions, type: ProjectResourceType): Promise<Paginated<IProjectResource>> {

        const model = this.getModelForType(type);

        const page = (options && options.page) ? options.page : 1;
        const limit = (options && options.itemsPerPage) ? options.itemsPerPage : 10;
        const filters = (options && options.filter) ? options.filter : {};
        const skip = (page-1) * limit;
        const sortBy = (options && options.sortBy)  ? options.sortBy : {};
        const populate = (options && options.populate)  ? options.populate : [];

        console.log(`search filters: ${JSON.stringify(filters)}`);

        const items = await model.find(filters).populate(populate).sort(sortBy).limit(limit).skip(skip);
        const total = await model.countDocuments(filters);

        const result: Paginated<IProjectResource> = {
            itemsPerPage: limit,
            results: items,
            total: total
        };

        console.log(`Search filtered to ${result.total} of ${await this.collectionCount()} documents.`);

        return result;

    }


}
