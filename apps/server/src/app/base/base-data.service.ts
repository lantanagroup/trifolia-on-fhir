import { Paginated, PaginateOptions } from "@trifolia-fhir/tof-lib";
import mongoose, { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "./base.entity";
import { TofLogger } from "../tof-logger";
import type { IBaseDataService } from "./interfaces";
import { Conformance, ConformanceSchema } from "../conformance/conformance.schema";


export class BaseDataService<T extends HydratedDocument<BaseEntity>> implements IBaseDataService {

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


    public async search(options?: PaginateOptions): Promise<Paginated<T>> {
        const page = (options && options.page) ? options.page : 1;
        const limit = (options && options.itemsPerPage) ? options.itemsPerPage : 10;
        const filters = (options && options.filter) ? options.filter : {};
        const skip = (page-1) * limit;
        const sortBy = (options && options.sortBy)  ? options.sortBy : {};
        const populate = (options && options.populate)  ? options.populate : [];

        //console.log(`search filters: ${JSON.stringify(filters)}`);

        const items = await this.model.find(filters).populate(populate).sort(sortBy).limit(limit).skip(skip);
        const total = await this.model.countDocuments(filters);

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

    public async findAll(filter = {}, populated = []): Promise<T[]> {
        return this.model.find(filter).populate(populated).exec();
    }

    public async findOne(filter = {}): Promise<T> {
        return this.model.findOne(filter).exec();
    }

    public async findById(id: string): Promise<T> {
        return this.model.findById(id).exec();
    }

    public async create(newDoc: BaseEntity) : Promise<T> {
        return await this.model.create(newDoc);
    }

    public async createMany(newDocs: BaseEntity[]) : Promise<T[]> {
        return await this.model.create(newDocs);
    }

    public async updateOne(id: string, doc: BaseEntity) : Promise<T> {
        return await this.model.findByIdAndUpdate(id, doc, { new: true });
    }

    public async delete(id: string) : Promise<T> {
        // TODO: soft delete
        return await this.model.findByIdAndRemove(id);
    }

}
