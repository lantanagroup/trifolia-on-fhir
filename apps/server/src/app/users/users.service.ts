import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { BaseDataService } from '../base/base-data.service';

@Injectable()
export class UsersService extends BaseDataService<UserDocument> {
    
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
        ) {
            super(userModel);
        }

}
