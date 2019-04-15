import {HttpModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
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

@Module({
  imports: [HttpModule],
  controllers: [
    AppController,
    AuditEventController,
    ConfigController,
    FhirController,
    ImplementationGuideController,
    PractitionerController,
    StructureDefinitionController,
    ValueSetController,
    CapabilityStatementController,
    ManageController,
    ExportController,
    ImportController
  ],
  providers: [],
})
export class AppModule {}
