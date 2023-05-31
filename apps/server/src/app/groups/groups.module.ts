import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './group.schema';

import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import {UsersModule} from '../users/users.module';

@Module({
    imports: [UsersModule, MongooseModule.forFeature([{name: Group.name, schema: GroupSchema}])],
    controllers: [GroupsController],
    exports: [GroupsService],
    providers: [GroupsService]
})
export class GroupsModule {}
