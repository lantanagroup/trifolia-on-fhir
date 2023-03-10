import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDataService } from '../base/base-data.service';
import {Conformance, ConformanceDocument} from './conformance.schema';

@Injectable()
export class ConformanceService extends BaseDataService<ConformanceDocument> {

    constructor(
        @InjectModel(Conformance.name) private conformanceModel: Model<ConformanceDocument>
    ) {
      super(conformanceModel);
    }

  }
