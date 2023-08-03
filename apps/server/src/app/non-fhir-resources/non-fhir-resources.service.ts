import { BadRequestException, Injectable } from '@nestjs/common';
import { TofLogger } from '../tof-logger';
import { NonFhirResource } from './non-fhir-resource.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {INonFhirResource, IHistory} from '@trifolia-fhir/models';
import {addToImplementationGuideNew, removeFromImplementationGuideNew} from '../helper';
import { HistoryService } from '../history/history.service';
import { FhirResourcesService } from '../fhirResources/fhirResources.service';
import { TofNotFoundException } from '../../not-found-exception';
import { IBaseDataService } from '../base/interfaces';
import { BaseEntity } from '../base/base.entity';
import { PaginateOptions, Paginated } from '@trifolia-fhir/tof-lib';
import { BaseDataService } from '../base/base-data.service';

@Injectable()
export class NonFhirResourcesService extends BaseDataService<INonFhirResource> { // implements IBaseDataService<INonFhirResource> { //extends BaseDataService<NonFhirResource> {

    protected readonly logger = new TofLogger(NonFhirResourcesService.name);

    constructor(
        @InjectConnection() private connection: Connection,
        private readonly fhirResourceService: FhirResourcesService,
        private readonly historyService: HistoryService) {
        //super(nonFhirResourceModel);
        super(connection.models[NonFhirResource.name])
    }
    
    
    public getModel(nonFhirResource?: INonFhirResource): Model<INonFhirResource> {
        console.log('in getModel:');

        if (!!nonFhirResource) {
            return this.connection.models[nonFhirResource.constructor.name];
        }
        
        return this.connection.models[NonFhirResource.name];
    }


    public async createNonFhirResource(newNonFhirResource: INonFhirResource, implementationGuideId?: string): Promise<INonFhirResource> {
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


        console.log(this.connection.models);
        let model = this.getModel();
        console.log('model doc count:', await model.estimatedDocumentCount());
        
        newNonFhirResource = await model.create(newNonFhirResource);

        let newHistory: IHistory = {
            content: newNonFhirResource.content,
            versionId: versionId,
            lastUpdated: lastUpdated,
            current: { value: newNonFhirResource.id, valueType: 'NonFhirResource'}
        }

        //await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (implementationGuideId) {
            await addToImplementationGuideNew(this.fhirResourceService, newNonFhirResource, implementationGuideId, true);
        }

        return newNonFhirResource;
    }

    public async updateNonFhirResource(id: string, upNonFhirResource: INonFhirResource, implementationGuideId?: string): Promise<INonFhirResource> {
        const lastUpdated = new Date();
        let versionId: number = 1;

        if (upNonFhirResource.id && upNonFhirResource.id !== id) {
            throw new BadRequestException();
        }

        let existing = await this.getModel().findById(id);

        if (!existing) {
            throw new TofNotFoundException();
        }

        if (!upNonFhirResource.content) {
            throw new BadRequestException(`No content provided.`);
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

        await this.getModel(existing).findByIdAndUpdate(existing.id, existing, { new: true });


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

    public async deleteNonFhirResource(id: string): Promise<INonFhirResource> {
      // remove from IG
      let resource = await this.getModel().findById(id);
      await removeFromImplementationGuideNew(this.fhirResourceService, resource);
      resource.isDeleted= true;
      return this.getModel(resource).findOneAndUpdate(resource.id, resource);
    }

}
