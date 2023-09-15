import {Paginated, PaginateOptions} from '@trifolia-fhir/tof-lib';
import {Model} from 'mongoose';
import {TofLogger} from '../tof-logger';
import type {IBaseDataService} from './interfaces';
import type { IBaseEntity } from '@trifolia-fhir/models';


export class BaseDataService<T extends IBaseEntity> implements IBaseDataService<T> {

    protected readonly logger = new TofLogger(BaseDataService.name);

    constructor(
        protected model: Model<T>
    ) {}


    public getEmpty(): T {
        return this.model.hydrate({});
    }

    public getModel() : Model<T> {
        return this.model;
    }


    public async search(options?: PaginateOptions, projections?: any): Promise<Paginated<T>> {
        const page = (options && options.page) ? options.page : 1;
        const limit = (options && options.itemsPerPage) ? options.itemsPerPage : 10;
        const filters = (options && options.filter) ? options.filter : {};
        const skip = (page-1) * limit;
        const sortBy = (options && options.sortBy)  ? options.sortBy : {};
        const populate = (options && options.populate)  ? options.populate : [];

        //console.log(`search filters: ${JSON.stringify(filters)}`);

        let deleteClause: any[] = [{ "isDeleted": { $exists: false } }, { isDeleted : false }];

        let allFilters = { $and: [filters, {$or: deleteClause}] };

        const items = await this.model.find(allFilters, projections).populate(populate).sort(sortBy).limit(limit).skip(skip);
        const total = await this.model.countDocuments(allFilters);

        const result: Paginated<T> = {
            itemsPerPage: limit,
            results: items,
            total: total
        };

        //console.log(`Search filtered to ${result.total} of ${await this.collectionCount()} documents.`);

        return result;
    }


    public async collectionCount(): Promise<number> {
        return this.model.estimatedDocumentCount().exec();
    }

    public async count(filter = {}): Promise<number> {
        return this.model.countDocuments(filter).exec();
    }

    public async findAll(filter = {},  populated = [], projections = {}): Promise<T[]> {
        return this.model.find(filter, projections).populate(populated).exec();
    }

    public async findOne(filter = {}): Promise<T> {
        return this.model.findOne(filter).exec();
    }

    public async findById(id: string): Promise<T> {
        return this.model.findById(id).exec();
    }

    public async create(newDoc: IBaseEntity) : Promise<T> {
        return await this.model.create(newDoc);
    }

    public async createMany(newDocs: IBaseEntity[]) : Promise<T[]> {
        return await this.model.create(newDocs);
    }

    public async updateOne(id: string, doc: IBaseEntity) : Promise<T> {
        return await this.model.findByIdAndUpdate(id, doc, { new: true });
    }

    public async delete(id: string) : Promise<T> {
        // TODO: soft delete
        return await this.model.findByIdAndRemove(id);
    }

}
