import { BadRequestException, Injectable } from '@nestjs/common';
import { TofLogger } from '../tof-logger';
import { NonFhirResource, NonFhirResourceDocument } from './nonFhirResource.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INonFhirResource, IHistory } from '@trifolia-fhir/models';
import { BaseDataService } from '../base/base-data.service';
import { addToImplementationGuideNew } from '../helper';
import { HistoryService } from '../history/history.service';
import { FhirResourcesService } from '../fhirResources/fhirResources.service';
import { TofNotFoundException } from '../../not-found-exception';

@Injectable()
export class NonFhirResourcesService extends BaseDataService<NonFhirResourceDocument> {

    protected readonly logger = new TofLogger(NonFhirResourcesService.name);

    constructor(
        @InjectModel(NonFhirResource.name) private examplesModel: Model<NonFhirResourceDocument>,
        private readonly fhirResourceService: FhirResourcesService,
        private readonly historyService: HistoryService) {
        super(examplesModel);
    }


    public async createExample(newExample: INonFhirResource, implementationGuideId?: string): Promise<INonFhirResource> {
        const lastUpdated = new Date();
        let versionId = 1;

        delete newExample.id;
        delete newExample['_id'];

        if (!newExample.content) {
            throw new BadRequestException(`No example content provided.`);
        }

        // ensure version ID and lastUpdated are set
        newExample.versionId = versionId;
        newExample.lastUpdated = lastUpdated;

        if (implementationGuideId) {
            newExample.referencedBy = newExample.referencedBy || [];
            if (!newExample.referencedBy.some(o => o.value === implementationGuideId)) {
                newExample.referencedBy.push({ value: implementationGuideId, valueType: 'NonFhirResource' });
            }
        }
        newExample = await this.examplesModel.create(newExample);

        let newHistory: IHistory = {
            content: newExample.content,
            versionId: versionId,
            lastUpdated: lastUpdated,
            current: { value: newExample.id, valueType: 'NonFhirResource'},
            isDeleted: false,
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (implementationGuideId) {
            await addToImplementationGuideNew(this.fhirResourceService, newExample, implementationGuideId, true);
        }

        return newExample;
    }

    public async updateExample(id: string, upExample: INonFhirResource, implementationGuideId?: string): Promise<INonFhirResource> {
        const lastUpdated = new Date();
        let versionId: number = 1;

        if (upExample.id && upExample.id !== id) {
            throw new BadRequestException();
        }

        let existing = await this.examplesModel.findById(id);

        if (!existing) {
            throw new TofNotFoundException();
        }

        if (!upExample.content) {
            throw new BadRequestException(`No example content provided.`);
        }

        // increment version
        if (existing.versionId) {
            versionId = existing.versionId + 1;
        }

        // update every property supplied from updated object
        for (let key in upExample) {
            existing[key] = upExample[key];
        }

        // set version and timestamp
        existing.versionId = versionId;
        existing.lastUpdated = lastUpdated;

        await this.examplesModel.findByIdAndUpdate(existing.id, existing, { new: true });


        let newHistory: IHistory = {
            content: existing.content,
            versionId: versionId,
            lastUpdated: lastUpdated,
            current: { value: existing.id, valueType: 'NonFhirResource'},
            isDeleted : false,
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (implementationGuideId) {
            await addToImplementationGuideNew(this.fhirResourceService, existing, implementationGuideId, true);
        }

        return existing;

    }

}
