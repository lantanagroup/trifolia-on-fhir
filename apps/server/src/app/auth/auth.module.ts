import { Global, Module, forwardRef } from '@nestjs/common';
import { FhirResourcesModule } from '../fhirResources/fhirResources.module';
import { GroupsModule } from '../groups/groups.module';
import { ProjectsModule } from '../projects/projects.module';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NonFhirResourcesModule } from '../non-fhir-resources/non-fhir-resources.module';

@Global()
@Module({
    imports: [
        SharedModule,
        forwardRef(() => GroupsModule),
        forwardRef(() => ProjectsModule),
        forwardRef(() => FhirResourcesModule),
        forwardRef(() => NonFhirResourcesModule),
        forwardRef(() => UsersModule)
    ],
    controllers: [AuthController],
    exports: [AuthService],
    providers: [AuthService],
})
export class AuthModule { }
