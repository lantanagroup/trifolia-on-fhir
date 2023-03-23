import { Injectable } from '@nestjs/common';
import { TofLogger } from '../tof-logger';
import { BaseDataService } from '../base/base-data.service';
import { History, HistoryDocument } from './history.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class HistoryService extends BaseDataService<HistoryDocument> {

    protected readonly logger = new TofLogger(HistoryService.name);

    constructor(@InjectModel(History.name) private historyModel: Model<HistoryDocument>) {
        super(historyModel);
    }

}
