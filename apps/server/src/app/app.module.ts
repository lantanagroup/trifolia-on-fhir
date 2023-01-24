import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { ConfigService } from './config.service';
import { GroupController } from './group.controller';
import { GithubController } from './github.controller';
import { ExportService } from './export.service';
import { SearchParameterController } from './search-parameter.controller';
import { FshController } from './fsh.controller';
import { Project, ProjectSchema } from '../db/schemas/project.schema';
import { DatabaseConfigService } from './database-config.service';
import { ProjectsService } from './services/projects.service';


@Module({
  imports: [
    HttpModule,
    MongooseModule.forRootAsync({
      imports: [AppModule],
      useExisting: DatabaseConfigService
    }),
    MongooseModule.forFeature([{name: Project.name, schema: ProjectSchema}])
  ],
  exports: [
    ConfigService,
    DatabaseConfigService
  ],
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
    GroupController,
    GithubController,
    SearchParameterController,
    FshController
  ],
  providers: [
    HttpStrategy,
    ConfigService,
    ExportService,
    ProjectsService,
    DatabaseConfigService
  ]
})
export class AppModule {}
