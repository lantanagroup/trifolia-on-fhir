import { Paginated, PaginateOptions } from "libs/tof-lib/src/lib/paginate";
import { Model } from "mongoose";


export class BaseDataService<T extends Document> {

    constructor(
        private model: Model<T>
    ) {}
    

    async search(options?: PaginateOptions): Promise<Paginated<T>> {
        const page = (options && options.page) ? options.page : 1;
        const limit = (options && options.itemsPerPage) ? options.itemsPerPage : 1;
        const filters = (options && options.filter) ? options.filter : {};
        const skip = (page-1) * limit;
        const sortBy = (options && options.sortBy)  ? options.sortBy : {};

        console.log('sortBy:', sortBy);
        const items = await this.model.find(filters).sort(sortBy).limit(limit).skip(skip);
        const total = await this.model.countDocuments(filters);

        const result: Paginated<T> = {
            itemsPerPage: limit,
            results: items,
            total: total
        };
        
        return result;
    }

    async findAll(filter = {}): Promise<T[]> {        
        return this.model.find(filter).exec();
    }

    async findById(id: string): Promise<T> {
        return this.model.findById(id).exec();
    }

    async create(newDoc: T) : Promise<T> {
        const createdDoc = new this.model(newDoc);
        return createdDoc.save();
    }

    async createMany(newDocs: T[]) : Promise<T[]> {
        return this.model.create(newDocs);
    }

    async updateOne(doc: T) : Promise<T> {
        this.model.findByIdAndUpdate()
        const createdDoc = new this.model();
        return createdDoc.save();
    }
    
    async delete(id: string) {
        const deleted = await this.model
            .findByIdAndRemove({ _id: id })
            .exec();
        return deleted;
    }

}