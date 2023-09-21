import {BadRequestException, Injectable} from '@nestjs/common';
import {TofLogger} from '../tof-logger';
import {NonFhirResourceDocument} from './non-fhir-resource.schema';
import {InjectConnection} from '@nestjs/mongoose';
import {Connection, Model, PipelineStage} from 'mongoose';
import {IHistory, INonFhirResource, NonFhirResource, NonFhirResourceType} from '@trifolia-fhir/models';
import {addPageToImplementationGuide, addToImplementationGuideNew, removeFromImplementationGuideNew, removePageFromImplementationGuide} from '../helper';
import {HistoryService} from '../history/history.service';
import {FhirResourcesService} from '../fhirResources/fhirResources.service';
import {TofNotFoundException} from '../../not-found-exception';
import {IBaseDataService} from '../base/interfaces';
import {Paginated, PaginateOptions} from '@trifolia-fhir/tof-lib';
import { ObjectId } from 'mongodb';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class NonFhirResourcesService implements IBaseDataService<NonFhirResourceDocument> {

    protected readonly logger = new TofLogger(NonFhirResourcesService.name);

    constructor(
        @InjectConnection() private connection: Connection,
        private readonly fhirResourceService: FhirResourcesService,
        private readonly historyService: HistoryService,
        private readonly projectsService: ProjectsService) {
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
        const pipeline: PipelineStage[] = (options && options.pipeline) ? options.pipeline : [];
        const skip = (page-1) * limit;
        const sortBy = (options && options.sortBy) ? options.sortBy : {};
        const populate = (options && options.populate) ? options.populate : [];
        const projection = (options && options.projection) ? options.projection : {};

        let deleteClause: any[] = [{ "isDeleted": { $exists: false } }, { isDeleted : false }];
        pipeline.push({$match: {$or: deleteClause}});
        // console.log(`search pipeline: ${JSON.stringify(pipeline)}`);

        let query = this.getModel().aggregate(pipeline);

        if (Object.keys(projection).length > 0) {
            query = query.project(projection);
        }

        if (Object.keys(sortBy).length > 0) {
            query = query.sort(sortBy);
        }
        query = query.limit(limit).skip(skip);

        let items = ((await query) || []).map(i => this.getModel().hydrate(i));
        if (populate.length > 0) {
            items = (await this.getModel().populate(items, populate.map(p => { return { path: p } })) || []);
        }

        const totalRes = await this.getModel().aggregate(pipeline).count('total');
        const total = (totalRes && totalRes.length > 0) ? totalRes[0]['total'] : 0;

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

    public async findAll(filter: any, populated = [], projection?: {[key: string]: any}): Promise<NonFhirResourceDocument[]> {
      let deleteClause: any[] = [{ "isDeleted": { $exists: false } }, { isDeleted : false }];
      let allFilters = { $and: [filter, {$or: deleteClause}] };
      if(projection) {
        return this.getModel().find(allFilters, projection).populate(populated);
      }
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

        if (!newNonFhirResource.projects) {
            newNonFhirResource.projects = [];
            if (implementationGuideId) {
                const projects = await this.projectsService.findAll({'references.valueType':'FhirResource', 'references.value': new ObjectId(implementationGuideId)});
                newNonFhirResource.projects.push(... (projects || []).map(p => p.id));
            }
        }

        newNonFhirResource = await this.getModel(newNonFhirResource).create(newNonFhirResource);
        let type = newNonFhirResource.type;

        let newHistory: IHistory = {
            content: newNonFhirResource.content,
            versionId: versionId,
            lastUpdated: lastUpdated,
            current: { value: newNonFhirResource.id, valueType: 'NonFhirResource'}
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (implementationGuideId) {
          if(type === NonFhirResourceType.Page){
            await addPageToImplementationGuide(this.fhirResourceService, newNonFhirResource, implementationGuideId);
          }
          else{
            await addToImplementationGuideNew(this.fhirResourceService, newNonFhirResource, implementationGuideId, true);
          }
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

        // ensure project references are set
        if (!existing.projects) {
            existing.projects = [];
        }
        if (implementationGuideId) {
            const projects = await this.projectsService.findAll({'references.valueType':'FhirResource', 'references.value': new ObjectId(implementationGuideId)});
            (projects || []).forEach(p => {
                if (!existing.projects.some(r => (typeof r === typeof {} && 'id' in r && r.id === p.id) || (r.toString() === p.id))) {
                    existing.projects.push(p);
                }
            });
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

        let type = upNonFhirResource.type;

        //Add it to the implementation Guide
        if (implementationGuideId) {
          if(type === NonFhirResourceType.Page){
            await addPageToImplementationGuide(this.fhirResourceService, upNonFhirResource, implementationGuideId);
          }
          else{
            await addToImplementationGuideNew(this.fhirResourceService, upNonFhirResource, implementationGuideId, true);
          }
      }

        return existing;

    }

    public async delete(id: string, implementationGuideId?: string): Promise<NonFhirResourceDocument> {
      // remove from IG

      let resource : NonFhirResourceDocument = await this.getModel().findById(id);
      let type = resource.type;

      if(type === NonFhirResourceType.Page){
        await removePageFromImplementationGuide(this.fhirResourceService, resource);
      }
      else {
        await removeFromImplementationGuideNew(this.fhirResourceService, resource);
      }
      resource.isDeleted= true;

      return this.castToModel(await this.getModel(resource).findByIdAndUpdate(id, { $set: { isDeleted: true } }));
    }

}
