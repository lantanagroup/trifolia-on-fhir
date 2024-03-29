import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import {AuditEventController} from './audit-event.controller';
import {ConfigController} from './config.controller';
import {FhirController} from './fhir.controller';
import {ImplementationGuideController} from './implementation-guide.controller';
import {PractitionerController} from './practitioner.controller';
import {StructureDefinitionController} from './structure-definition.controller';
import {ValueSetController} from './value-set.controller';
import {CapabilityStatementController} from './capability-statement.controller';
import {ManageController} from './manage.controller';
import {ExportController} from './export.controller';
import {ImportController} from './import.controller';
import {HttpStrategy} from './auth.strategy';
import {OperationDefinitionController} from './operation-definition.controller';
import {CodeSystemController} from './code-system.controller';
import {QuestionnaireController} from './questionnaire.controller';
import {GithubController} from './github.controller';
import {ExportService} from './export.service';
import {SearchParameterController} from './search-parameter.controller';
import {FshController} from './fsh.controller';
import {SharedModule} from './shared/shared.module';
import {ProjectsModule} from './projects/projects.module';
import {UsersModule} from './users/users.module';
import {ManageModule} from './manage/manage.module';
import {GroupsModule} from './groups/groups.module';
import {AuthModule} from './auth/auth.module';
import {FhirResourcesModule} from './fhir-resources/fhir-resources.module';
import {NonFhirResourcesModule} from './non-fhir-resources/non-fhir-resources.module';
import {HistoryModule} from './history/history.module';
import {AuditModule} from './audit/audit.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './audit/audit-entity.interceptor';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    ProjectsModule,
    UsersModule,
    ManageModule,
    GroupsModule,
    AuthModule,
    FhirResourcesModule,
    NonFhirResourcesModule,
    HistoryModule,
    AuditModule
  ],
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
  ],
  providers: [HttpStrategy, ExportService,
  {
    provide: APP_INTERCEPTOR,
    useClass: AuditInterceptor
  }],
})
export class AppModule {}
