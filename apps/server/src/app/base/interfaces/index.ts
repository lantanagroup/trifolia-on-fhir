import { BaseEntity } from "../base.entity";


export interface IBaseDataService {
    collectionCount(): Promise<number>;
    count(filter: any): Promise<number>;
    findAll(filter: any): Promise<any[]>;
    findOne(filter: any): Promise<any>;
    findById(id: string): Promise<any>;
    create(newDoc: BaseEntity): Promise<any>;
    createMany(newDocs: BaseEntity[]): Promise<any[]>;
    updateOne(id: string, doc: BaseEntity) : Promise<any>;
    delete(id: string) : Promise<any>;
}
  