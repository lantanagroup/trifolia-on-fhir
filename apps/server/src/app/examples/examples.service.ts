import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TofLogger } from '../tof-logger';
import { Example, ExampleDocument } from './example.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IExample, IHistory } from '@trifolia-fhir/models';
import { BaseDataService } from '../base/base-data.service';
import { addToImplementationGuideNew } from '../helper';
import { HistoryService } from '../history/history.service';
import { ConformanceService } from '../conformance/conformance.service';

@Injectable()
export class ExamplesService extends BaseDataService<ExampleDocument> {

    protected readonly logger = new TofLogger(ExamplesService.name);

    constructor(
        @InjectModel(Example.name) private examplesModel: Model<ExampleDocument>,
        private readonly conformanceService: ConformanceService,
        private readonly historyService: HistoryService) {
        super(examplesModel);
    }


    public async createExample(newExample: IExample, implementationGuideId?: string): Promise<IExample> {
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
            newExample.igIds = newExample.igIds || [];
            if (newExample.igIds.indexOf(implementationGuideId) < 0) {
                newExample.igIds.push(implementationGuideId);
            }
        }
        newExample = await this.examplesModel.create(newExample);

        let newHistory: IHistory = {
            content: newExample.content,
            versionId: versionId,
            lastUpdated: lastUpdated,
            targetId: newExample.id,
            type: 'example'
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (implementationGuideId) {
            await addToImplementationGuideNew(this.conformanceService, newExample, implementationGuideId, true);
        }

        return newExample;
    }

    public async updateExample(id: string, upExample: IExample, implementationGuideId?: string): Promise<IExample> {
        const lastUpdated = new Date();
        let versionId: number = 1;

        if (upExample.id && upExample.id !== id) {
            throw new BadRequestException();
        }

        let existing = await this.examplesModel.findById(id);

        if (!existing) {
            throw new NotFoundException();
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
            targetId: existing.id,
            type: 'example'
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (implementationGuideId) {
            await addToImplementationGuideNew(this.conformanceService, existing, implementationGuideId, true);
        }

        return existing;

    }

}
