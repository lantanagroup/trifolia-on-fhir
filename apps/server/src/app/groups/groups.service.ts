import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './group.schema';
import { BaseDataService } from '../base/base-data.service';
import { IGroup } from '@trifolia-fhir/models';
import { ObjectId } from 'mongodb';

@Injectable()
export class GroupsService extends BaseDataService<GroupDocument> {

    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>
    ) {
        super(groupModel);
    }


    public async getForUser(userId: string) : Promise<IGroup[]> {
        return this.findAll({members: new ObjectId(userId)});
    }

}
