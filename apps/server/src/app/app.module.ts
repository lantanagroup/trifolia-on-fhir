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
import { GroupController } from './group.controller';
import { GithubController } from './github.controller';
import { ExportService } from './export.service';
import { SearchParameterController } from './search-parameter.controller';
import { FshController } from './fsh.controller';
import { SharedModule } from './shared.module';
import { UsersController } from './controllers/users/users.controller';

@Module({
  imports: [HttpModule, SharedModule],
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
    GroupController,
    GithubController,
    SearchParameterController,
    FshController,
    UsersController,
  ],
  providers: [HttpStrategy, ExportService],
})
export class AppModule {}
