import { PaginateOptions, Paginated } from "@trifolia-fhir/tof-lib";
import { BaseEntity } from "../base.entity";


export interface IBaseDataService<T> {
    collectionCount(): Promise<number>;
    count(filter: any): Promise<number>;
    findAll(filter: any): Promise<T[]>;
    findOne(filter: any): Promise<T>;
    findById(id: string): Promise<T>;
    create(newDoc: BaseEntity): Promise<T>;
    createMany(newDocs: BaseEntity[]): Promise<T[]>;
    updateOne(id: string, doc: BaseEntity) : Promise<T>;
    delete(id: string) : Promise<T>;
    search(options?: PaginateOptions): Promise<Paginated<T>>;
}
  