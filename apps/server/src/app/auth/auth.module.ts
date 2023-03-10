import { Module } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { ProjectsModule } from '../projects/projects.module';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [GroupsModule, ProjectsModule, SharedModule, UsersModule],
    controllers: [AuthController],
    exports: [AuthService],
    providers: [AuthService],
})
export class AuthModule { }
