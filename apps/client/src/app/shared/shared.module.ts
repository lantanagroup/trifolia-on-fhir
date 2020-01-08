import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FhirService} from './fhir.service';
import {AuditEventService} from './audit-event.service';
import {AuthService} from './auth.service';
import {CapabilityStatementService} from './capability-statement.service';
import {CodeSystemService} from './code-system.service';
import {ConfigService} from './config.service';
import {ExportService} from './export.service';
import {GithubService} from './github.service';
import {ImplementationGuideService} from './implementation-guide.service';
import {ImportService} from './import.service';
import {OperationDefinitionService} from './operation-definition.service';
import {PractitionerService} from './practitioner.service';
import {QuestionnaireService} from './questionnaire.service';
import {RecentItemService} from './recent-item.service';
import {SocketService} from './socket.service';
import {StructureDefinitionService} from './structure-definition.service';
import {UserService} from './user.service';
import {ValueSetService} from './value-set.service';
import {FileService} from './file.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GroupService} from './group.service';
import {ManageService} from './manage.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbModule
  ],
  providers: [
    AuditEventService,
    AuthService,
    CapabilityStatementService,
    CodeSystemService,
    ConfigService,
    ExportService,
    FhirService,
    FileService,
    GithubService,
    ImplementationGuideService,
    ImportService,
    OperationDefinitionService,
    PractitionerService,
    QuestionnaireService,
    RecentItemService,
    SocketService,
    StructureDefinitionService,
    UserService,
    ValueSetService,
    GroupService,
    ManageService
  ],
  exports: []
})
export class SharedModule {
}
