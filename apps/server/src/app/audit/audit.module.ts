import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Audit, AuditSchema} from './audit.schema';

import {AuditController} from './audit.controller';
import {AuditService} from './audit.service';
import { FhirResource, FhirResourceSchema } from '../fhir-resources/fhir-resource.schema';
import { NonFhirResource } from '@trifolia-fhir/models';
import { NonFhirResourceSchema } from '../non-fhir-resources/non-fhir-resource.schema';
import { Group } from '@trifolia-fhir/stu3';
import { GroupSchema } from '../groups/group.schema';
import { User } from '../server.decorators';
import { UserSchema } from '../users/user.schema';
import { Project, ProjectSchema } from '../projects/project.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Audit.name, schema: AuditSchema },
    { name: Group.name, schema: GroupSchema },
    { name: FhirResource.name, schema: FhirResourceSchema },
    { name: NonFhirResource.name, schema: NonFhirResourceSchema },
    { name: Project.name, schema: ProjectSchema },
    { name: User.name, schema: UserSchema }

  ])],
  exports: [AuditService],
  providers: [AuditService],
  controllers: [AuditController]
})
export class AuditModule {
}
