import {HttpModule, Module} from '@nestjs/common';
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
import {ConfigService} from './config.service';
import {GroupController} from './group.controller';
import {GithubController} from './github.controller';
import { ExportService } from './export.service';


@Module({
  imports: [HttpModule],
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
    GithubController
  ],
  providers: [
    HttpStrategy,
    ConfigService,
    ExportService
  ],
})
export class AppModule {}
