import { BadRequestException, Injectable } from '@nestjs/common';
import { TofLogger } from '../tof-logger';
import { NonFhirResourceDocument } from './non-fhir-resource.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {INonFhirResource, IHistory, NonFhirResourceType, NonFhirResource} from '@trifolia-fhir/models';
import {addToImplementationGuideNew, removeFromImplementationGuideNew} from '../helper';
import { HistoryService } from '../history/history.service';
import { FhirResourcesService } from '../fhirResources/fhirResources.service';
import { TofNotFoundException } from '../../not-found-exception';
import { IBaseDataService } from '../base/interfaces';
import { PaginateOptions, Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class NonFhirResourcesService implements IBaseDataService<NonFhirResourceDocument> {

    protected readonly logger = new TofLogger(NonFhirResourcesService.name);

    constructor(
        @InjectConnection() private connection: Connection,
        private readonly fhirResourceService: FhirResourcesService,
        private readonly historyService: HistoryService) {
    }


    public getModel(nonFhirResource?: INonFhirResource): Model<NonFhirResourceDocument> {

        // check for corresponding model by resource type if valid
        if (!!nonFhirResource && Object.values(NonFhirResourceType).includes(nonFhirResource.type)) {
            return this.connection.models[nonFhirResource.type];
        }

        // otherwise... check for corresponding model by provided object's constructor name
        else if (!!nonFhirResource && Object.values(NonFhirResourceType).some(e => e.toString() === nonFhirResource?.constructor?.name)) {
            return this.connection.models[nonFhirResource.constructor.name];
        }

        return this.connection.models[NonFhirResource.name];
    }

    public castToModel(res: NonFhirResourceDocument): NonFhirResourceDocument {
        let model = this.getModel(res);
        return model.hydrate(model.castObject(res));
    }


    public async search(options?: PaginateOptions): Promise<Paginated<NonFhirResourceDocument>> {
        const page = (options && options.page) ? options.page : 1;
        const limit = (options && options.itemsPerPage) ? options.itemsPerPage : 10;
        const filters = (options && options.filter) ? options.filter : {};
        const skip = (page-1) * limit;
        const sortBy = (options && options.sortBy)  ? options.sortBy : {};
        const populate = (options && options.populate)  ? options.populate : [];

        let deleteClause: any[] = [{ "isDeleted": { $exists: false } }, { isDeleted : false }];

        let allFilters = { $and: [filters, {$or: deleteClause}] };

        const items = await this.getModel().find(allFilters).populate(populate).sort(sortBy).limit(limit).skip(skip);
        const total = await this.getModel().countDocuments(allFilters);

        const result: Paginated<NonFhirResourceDocument> = {
            itemsPerPage: limit,
            results: items,
            total: total
        };

        return result;
    }


    public async collectionCount(): Promise<number> {
        return this.getModel().estimatedDocumentCount().exec();
    }
    public async count(filter: any): Promise<number> {
      let deleteClause: any[] = [{ "isDeleted": { $exists: false } }, { isDeleted : false }];
      let allFilters = { $and: [filter, {$or: deleteClause}] };
      return this.getModel().countDocuments(allFilters).exec();
    }

    public async findAll(filter: any, populated = []): Promise<NonFhirResourceDocument[]> {
      let deleteClause: any[] = [{ "isDeleted": { $exists: false } }, { isDeleted : false }];
      let allFilters = { $and: [filter, {$or: deleteClause}] };
      return this.getModel().find(allFilters).populate(populated);
    }

    public async findOne(filter: any): Promise<NonFhirResourceDocument> {
      let deleteClause: any[] = [{ "isDeleted": { $exists: false } }, { isDeleted : false }];
      let allFilters = { $and: [filter, {$or: deleteClause}] };
      return this.castToModel(await this.getModel().findOne(allFilters));
    }
    public async findById(id: string): Promise<NonFhirResourceDocument> {
        return this.castToModel(await this.getModel().findById(id));
    }

    public async create(newNonFhirResource: NonFhirResourceDocument, implementationGuideId?: string): Promise<NonFhirResourceDocument> {
        const lastUpdated = new Date();
        let versionId = 1;

        delete newNonFhirResource.id;
        delete newNonFhirResource['_id'];

        if (!newNonFhirResource.content) {
            throw new BadRequestException(`No content provided.`);
        }

        // ensure version ID and lastUpdated are set
        newNonFhirResource.versionId = versionId;
        newNonFhirResource.lastUpdated = lastUpdated;
        newNonFhirResource.isDeleted = false;

        if (implementationGuideId) {
            newNonFhirResource.referencedBy = newNonFhirResource.referencedBy || [];
            if (!newNonFhirResource.referencedBy.some(o => o.value === implementationGuideId)) {
                newNonFhirResource.referencedBy.push({ value: implementationGuideId, valueType: 'FhirResource' });
            }
        }

        newNonFhirResource = await this.getModel(newNonFhirResource).create(newNonFhirResource);

        let newHistory: IHistory = {
            content: newNonFhirResource.content,
            versionId: versionId,
            lastUpdated: lastUpdated,
            current: { value: newNonFhirResource.id, valueType: 'NonFhirResource'}
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (implementationGuideId) {
            await addToImplementationGuideNew(this.fhirResourceService, newNonFhirResource, implementationGuideId, true);
        }

        return newNonFhirResource;
    }

    public async createMany(newDocs: NonFhirResourceDocument[], implementationGuideId?: string): Promise<NonFhirResourceDocument[]> {
        const res: NonFhirResourceDocument[] = [];

        for(const doc of newDocs) {
            res.push(await this.create(doc, implementationGuideId));
        }

        return res;
    }


    public async updateOne(id: string, upNonFhirResource: NonFhirResourceDocument, implementationGuideId?: string): Promise<NonFhirResourceDocument> {
        const lastUpdated = new Date();
        let versionId: number = 1;

        if (upNonFhirResource.id && upNonFhirResource.id !== id) {
            throw new BadRequestException('ID does not match');
        }

        if (!upNonFhirResource.type || Object.keys(NonFhirResourceType).indexOf(upNonFhirResource.type) < 0) {
            throw new BadRequestException('Invalid type provided');
        }
        
        let model = this.getModel(upNonFhirResource);
        let existing = await model.findById(id);

        if (!existing) {
            throw new TofNotFoundException();
        }

        // increment version
        if (existing.versionId) {
            versionId = existing.versionId + 1;
        }

        // update every property supplied from updated object
        for (let key in upNonFhirResource) {
            existing[key] = upNonFhirResource[key];
        }

        // set version and timestamp
        existing.versionId = versionId;
        existing.lastUpdated = lastUpdated;
        existing.isDeleted = false;

        await model.findByIdAndUpdate(existing.id, existing, { new: true });

        let newHistory: IHistory = {
            content: existing.content,
            versionId: versionId,
            lastUpdated: lastUpdated,
            current: { value: existing.id, valueType: 'NonFhirResource'}
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (implementationGuideId) {
            await addToImplementationGuideNew(this.fhirResourceService, existing, implementationGuideId, true);
        }

        return existing;

    }

    public async delete(id: string): Promise<NonFhirResourceDocument> {
      // remove from IG
      let resource = await this.getModel().findById(id);
      await removeFromImplementationGuideNew(this.fhirResourceService, resource);
      resource.isDeleted= true;
      return this.castToModel(await this.getModel(resource).findByIdAndUpdate(id, { $set: { isDeleted: true } }));
    }

}
