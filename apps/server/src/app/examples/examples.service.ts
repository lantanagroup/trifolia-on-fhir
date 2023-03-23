import { Injectable } from '@nestjs/common';
import { TofLogger } from '../tof-logger';
import { BaseDataService } from '../base/base-data.service';
import { Example, ExampleDocument } from './example.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ExamplesService extends BaseDataService<ExampleDocument> {

    protected readonly logger = new TofLogger(ExamplesService.name);

    constructor(@InjectModel(Example.name) private examplesModel: Model<ExampleDocument>) {
        super(examplesModel);
    }

}
