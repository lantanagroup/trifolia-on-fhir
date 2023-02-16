import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { BaseDataService } from '../base-data.service';

@Injectable()
export class UsersService extends BaseDataService<UserDocument> {
    
    constructor(
        @InjectModel(User.name) private projectModel: Model<UserDocument>
        ) {
            super(projectModel);
        }

}
