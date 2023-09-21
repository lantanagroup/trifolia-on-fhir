import type { IBaseEntity } from "@trifolia-fhir/models";
import { PaginateOptions, Paginated } from "@trifolia-fhir/tof-lib";
import { Model } from "mongoose";


export interface IBaseDataService<T> {
    getModel(): Model<T>;
    collectionCount(): Promise<number>;
    count(filter: any): Promise<number>;
    findAll(filter: any, projection: any): Promise<T[]>;
    findOne(filter: any): Promise<T>;
    findById(id: string): Promise<T>;
    create(newDoc: IBaseEntity): Promise<T>;
    createMany(newDocs: IBaseEntity[]): Promise<T[]>;
    updateOne(id: string, doc: IBaseEntity) : Promise<T>;
    delete(id: string) : Promise<T>;
    search(options?: PaginateOptions): Promise<Paginated<T>>;
}
