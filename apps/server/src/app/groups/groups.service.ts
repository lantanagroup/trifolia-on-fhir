import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './group.schema';
import { BaseDataService } from '../base/base-data.service';

@Injectable()
export class GroupsService extends BaseDataService<GroupDocument> {

    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>
        ) {
            super(groupModel);
        }

}
