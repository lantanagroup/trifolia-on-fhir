import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './group.schema';

import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import {UsersService} from '../users/users.service';
import {UsersModule} from '../users/users.module';
import {User, UserSchema} from '../users/user.schema';

@Module({
    imports: [UsersModule, MongooseModule.forFeature([{name: Group.name, schema: GroupSchema}, {name: User.name, schema: UserSchema}])],
    controllers: [GroupsController],
    exports: [GroupsService],
    providers: [GroupsService]
})
export class GroupsModule {}
