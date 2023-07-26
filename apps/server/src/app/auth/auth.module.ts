import { Global, Module } from '@nestjs/common';
import { FhirResourcesModule } from '../fhirResources/fhirResources.module';
import { GroupsModule } from '../groups/groups.module';
import { ProjectsModule } from '../projects/projects.module';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
    imports: [
        SharedModule,
        // forwardRef(() => GroupsModule),
        // forwardRef(() => ProjectsModule),
        // forwardRef(() => FhirResourcesModule),
        // forwardRef(() => UsersModule)
        GroupsModule,
        ProjectsModule,
        FhirResourcesModule,
        UsersModule
    ],
    controllers: [AuthController],
    exports: [AuthService],
    providers: [AuthService],
})
export class AuthModule { }
