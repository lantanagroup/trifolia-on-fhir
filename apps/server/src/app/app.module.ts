import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuditEventController } from './audit-event.controller';
import { ConfigController } from './config.controller';
import { FhirController } from './fhir.controller';
import { ImplementationGuideController } from './implementation-guide.controller';
import { PractitionerController } from './practitioner.controller';
import { StructureDefinitionController } from './structure-definition.controller';
import { ValueSetController } from './value-set.controller';
import { CapabilityStatementController } from './capability-statement.controller';
import { ManageController } from './manage.controller';
import { ExportController } from './export.controller';
import { ImportController } from './import.controller';
import { HttpStrategy } from './auth.strategy';
import { OperationDefinitionController } from './operation-definition.controller';
import { CodeSystemController } from './code-system.controller';
import { QuestionnaireController } from './questionnaire.controller';
//import { GroupController } from './group.controller';
import { GithubController } from './github.controller';
import { ExportService } from './export.service';
import { SearchParameterController } from './search-parameter.controller';
import { FshController } from './fsh.controller';
import { SharedModule } from './shared/shared.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { ManageModule } from './manage/manage.module';
import { GroupsModule } from './groups/groups.module';
import {GroupsController} from './groups/groups.controller';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    ProjectsModule,
    UsersModule,
    ManageModule,
    GroupsModule],
  exports: [],
  controllers: [
    AuditEventController,
    ConfigController,
    FhirController,
    ImplementationGuideController,
    PractitionerController,
    StructureDefinitionController,
    ValueSetController,
    CodeSystemController,
    CapabilityStatementController,
    OperationDefinitionController,
    QuestionnaireController,
    ManageController,
    ExportController,
    ImportController,
    GithubController,
    SearchParameterController,
    FshController,
    GroupsController
  ],
  providers: [HttpStrategy, ExportService],
})
export class AppModule {}
