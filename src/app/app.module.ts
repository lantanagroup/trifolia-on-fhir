import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http, RequestOptions} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuidesComponent} from './implementation-guides/implementation-guides.component';
import {HomeComponent} from './home/home.component';
import {ImplementationGuideComponent} from './implementation-guide/implementation-guide.component';
import {RouterModule, Routes} from '@angular/router';
import {ExportComponent} from './export/export.component';
import {ImportComponent} from './import/import.component';
import {StructureDefinitionComponent} from './structure-definition/structure-definition.component';
import {ValuesetsComponent} from './valuesets/valuesets.component';
import {ValuesetComponent} from './valueset/valueset.component';
import {CodesystemsComponent} from './codesystems/codesystems.component';
import {CodesystemComponent} from './codesystem/codesystem.component';
import {LoginComponent} from './login/login.component';
import {StructureDefinitionsComponent} from './structure-definitions/structure-definitions.component';
import {UsersComponent} from './users/users.component';
import {UserComponent} from './user/user.component';
import {AuthService} from './services/auth.service';
import {PractitionerService} from './services/practitioner.service';
import {HumanNameComponent} from './fhir-edit/human-name/human-name.component';
import {HumanNamesComponent} from './fhir-edit/human-names/human-names.component';
import {NewProfileComponent} from './new-profile/new-profile.component';
import {CookieService} from 'angular2-cookie/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StringComponent} from './fhir-edit/string/string.component';
import {SelectChoiceModalComponent} from './select-choice-modal/select-choice-modal.component';
import {ElementDefinitionPanelComponent} from './element-definition-panel/element-definition-panel.component';
import {ElementDefinitionTypeModalComponent} from './fhir-edit/element-definition-type-modal/element-definition-type-modal.component';
import {Globals} from './globals';
import {MarkdownComponent} from './markdown/markdown.component';
import {AuditEventService} from './services/audit-event.service';
import {KeysPipe} from './pipes/keys-pipe';
import {ReferenceComponent} from './fhir-edit/reference/reference.component';
import {FhirDisplayPipe} from './pipes/fhir-display-pipe';
import {PageComponentModalComponent} from './fhir-edit/page-component-modal/page-component-modal.component';
import {RecentItemService} from './services/recent-item.service';
import {BinaryService} from './services/binary.service';
import {CapabilityStatementsComponent} from './capability-statements/capability-statements.component';
import {OperationDefinitionsComponent} from './operation-definitions/operation-definitions.component';
import {OperationDefinitionComponent} from './operation-definition/operation-definition.component';
import {CapabilityStatementService} from './services/capability-statement.service';
import {OperationDefinitionService} from './services/operation-definition.service';
import {MultiContactComponent} from './fhir-edit/multi-contact/multi-contact.component';
import {MultiUseContextComponent} from './fhir-edit/multi-use-context/multi-use-context.component';
import {MultiJurisdictionComponent} from './fhir-edit/multi-jurisdiction/multi-jurisdiction.component';
import {MaxCardinalityComponent} from './fhir-edit/max-cardinality/max-cardinality.component';
import {OperationDefinitionParameterModalComponent} from './operation-definition-parameter-modal/operation-definition-parameter-modal.component';
import {ValueSetService} from './services/value-set.service';
import {CodeSystemService} from './services/code-system.service';
import {BooleanComponent} from './fhir-edit/boolean/boolean.component';
import {FhirMarkdownComponent} from './fhir-edit/markdown/markdown.component';
import {FhirDateComponent} from './fhir-edit/date/date.component';
import {ValuesetExpandComponent} from './valueset-expand/valueset-expand.component';
import {SelectSingleCodeComponent} from './fhir-edit/select-single-code/select-single-code.component';
import {MultiIdentifierComponent} from './fhir-edit/multi-identifier/multi-identifier.component';
import {SelectMultiCodingComponent} from './fhir-edit/select-multi-coding/select-multi-coding.component';
import {ContactModalComponent} from './fhir-edit/contact-modal/contact-modal.component';
import {IdentifierModalComponent} from './fhir-edit/identifier-modal/identifier-modal.component';
import {ChoiceComponent} from './fhir-edit/choice/choice.component';
import {MarkdownModalComponent} from './markdown-modal/markdown-modal.component';
import {ValidationResultsComponent} from './validation-results/validation-results.component';
import {FhirEditAddressModalComponent} from './fhir-edit/address-modal/address-modal.component';
import {QuantityComponent} from './fhir-edit/quantity/quantity.component';
import {IdentifierComponent} from './fhir-edit/identifier/identifier.component';
import {AttachmentComponent} from './fhir-edit/attachment/attachment.component';
import {FhirEditAttachmentModalComponent} from './fhir-edit/attachment-modal/attachment-modal.component';
import {FhirEditCodeableConceptModalComponent} from './fhir-edit/codeable-concept-modal/codeable-concept-modal.component';
import {FhirEditCodingModalComponent} from './fhir-edit/coding-modal/coding-modal.component';
import {FhirEditContactPointModalComponent} from './fhir-edit/contact-point-modal/contact-point-modal.component';
import {FhirEditHumanNameModalComponent} from './fhir-edit/human-name-modal/human-name-modal.component';
import {FhirEditPeriodComponent} from './fhir-edit/period/period.component';
import {FhirEditRangeComponent} from './fhir-edit/range/range.component';
import {FhirEditRangeModalComponent} from './fhir-edit/range-modal/range-modal.component';
import {FhirEditRatioComponent} from './fhir-edit/ratio/ratio.component';
import {FhirEditRatioModalComponent} from './fhir-edit/ratio-modal/ratio-modal.component';
import {FhirEditCodesystemConceptModalComponent} from './fhir-edit/codesystem-concept-modal/codesystem-concept-modal.component';
import {FhirEditCapabilityStatementResourceModalComponent} from './fhir-edit/capability-statement-resource-modal/capability-statement-resource-modal.component';
import {FhirEditMessagingEventModalComponent} from './fhir-edit/messaging-event-modal/messaging-event-modal.component';
import {CapabilityStatementWrapperComponent} from './capability-statement-wrapper/capability-statement-wrapper.component';
import {CapabilityStatementComponent as STU3CapabilityStatementComponent} from './capability-statement-wrapper/stu3/capability-statement.component';
import {CapabilityStatementComponent as R4CapabilityStatementComponent} from './capability-statement-wrapper/r4/capability-statement.component';
import {XmlPipe} from './pipes/xml-pipe';
import {FileDropModule} from 'ngx-file-drop';
import {FhirEditReferenceModalComponent} from './fhir-edit/reference-modal/reference-modal.component';
import {FhirService} from './services/fhir.service';
import {FileService} from './services/file.service';
import {ConfigService} from './services/config.service';
import { FileOpenModalComponent} from './file-open-modal/file-open-modal.component';
import {ImplementationGuideService} from './services/implementation-guide.service';
import {StructureDefinitionService} from './services/structure-definition.service';
import {ImportService} from './services/import.service';
import {ExportService} from './services/export.service';
import {NewUserModalComponent} from './new-user-modal/new-user-modal.component';
import {ChangeResourceIdModalComponent} from './change-resource-id-modal/change-resource-id-modal.component';
import {FhirXmlPipe} from './pipes/fhir-xml-pipe';
import {TooltipIconComponent} from './tooltip-icon/tooltip-icon.component';
import {FhirEditValueSetIncludeConceptModalComponent} from './fhir-edit/value-set-include-concept-modal/value-set-include-concept-modal.component';
import {RawResourceComponent} from './raw-resource/raw-resource.component';
import {ValuesetConceptCardComponent} from './valueset-concept-card/valueset-concept-card.component';
import {ImplementationGuideViewComponent} from './implementation-guide-view/implementation-guide-view.component';
import {SafePipe} from './pipes/safe-pipe';
import {OtherResourcesComponent} from './other-resources/other-resources.component';
import {QuestionnairesComponent} from './questionnaires/questionnaires.component';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {FhirEditPractitionerComponent} from './fhir-edit/practitioner/practitioner.component';

export class AddHeaderInterceptor implements HttpInterceptor {
    constructor() {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('id_token');
        const fhirServer = localStorage.getItem('fhirServer');
        const headers = {};

        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        if (fhirServer) {
            headers['fhirServer'] = fhirServer;
        }

        const clonedRequest = req.clone({
            setHeaders: headers
        });

        return next.handle(clonedRequest);
    }
}

export function cookieServiceFactory() {
    return new CookieService();
}

const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'implementation-guide', component: ImplementationGuidesComponent},
    {path: 'implementation-guide/new', component: ImplementationGuideComponent},
    {path: 'implementation-guide/:id/view', component: ImplementationGuideViewComponent, runGuardsAndResolvers: 'always'},
    {path: 'implementation-guide/:id', component: ImplementationGuideComponent, runGuardsAndResolvers: 'always'},
    {path: 'structure-definition', component: StructureDefinitionsComponent},
    {path: 'structure-definition/new', component: NewProfileComponent},
    {path: 'structure-definition/:id', component: StructureDefinitionComponent, runGuardsAndResolvers: 'always'},
    {path: 'capability-statement', component: CapabilityStatementsComponent},
    {path: 'capability-statement/new', component: CapabilityStatementWrapperComponent},
    {path: 'capability-statement/:id', component: CapabilityStatementWrapperComponent, runGuardsAndResolvers: 'always'},
    {path: 'operation-definition', component: OperationDefinitionsComponent},
    {path: 'operation-definition/new', component: OperationDefinitionComponent},
    {path: 'operation-definition/:id', component: OperationDefinitionComponent, runGuardsAndResolvers: 'always'},
    {path: 'value-set', component: ValuesetsComponent},
    {path: 'value-set/:id', component: ValuesetComponent, runGuardsAndResolvers: 'always'},
    {path: 'value-set/:id/expand', component: ValuesetExpandComponent, runGuardsAndResolvers: 'always'},
    {path: 'code-system', component: CodesystemsComponent},
    {path: 'code-system/:id', component: CodesystemComponent, runGuardsAndResolvers: 'always'},
    {path: 'questionnaire', component: QuestionnairesComponent},
    {path: 'questionnaire/new', component: QuestionnaireComponent},
    {path: 'questionnaire/:id', component: QuestionnaireComponent, runGuardsAndResolvers: 'always'},
    {path: 'other-resources', component: OtherResourcesComponent},
    {path: 'export', component: ExportComponent},
    {path: 'import', component: ImportComponent},
    {path: 'users', component: UsersComponent},
    {path: 'users/me', component: UserComponent},
    {path: 'users/:id', component: UserComponent, runGuardsAndResolvers: 'always'},
    {path: 'login', component: LoginComponent},
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

export function getConfig(configService: ConfigService) {
    return () => configService.getConfig();
}

@NgModule({
    entryComponents: [
        SelectChoiceModalComponent,
        ElementDefinitionTypeModalComponent,
        PageComponentModalComponent,
        OperationDefinitionParameterModalComponent,
        ContactModalComponent,
        IdentifierModalComponent,
        MarkdownModalComponent,
        FhirEditAddressModalComponent,
        FhirEditAttachmentModalComponent,
        FhirEditCodeableConceptModalComponent,
        FhirEditCodingModalComponent,
        FhirEditContactPointModalComponent,
        FhirEditHumanNameModalComponent,
        FhirEditRangeModalComponent,
        FhirEditRatioModalComponent,
        FhirEditCodesystemConceptModalComponent,
        FhirEditCapabilityStatementResourceModalComponent,
        FhirEditMessagingEventModalComponent,
        STU3CapabilityStatementComponent,
        R4CapabilityStatementComponent,
        FhirEditReferenceModalComponent,
        FileOpenModalComponent,
        NewUserModalComponent,
        ChangeResourceIdModalComponent,
        FhirEditValueSetIncludeConceptModalComponent
    ],
    declarations: [
        AppComponent,
        KeysPipe,
        FhirDisplayPipe,
        FhirXmlPipe,
        SafePipe,
        XmlPipe,
        ImplementationGuidesComponent,
        HomeComponent,
        ImplementationGuideComponent,
        ExportComponent,
        ImportComponent,
        StructureDefinitionComponent,
        ValuesetsComponent,
        ValuesetComponent,
        CodesystemsComponent,
        CodesystemComponent,
        LoginComponent,
        StructureDefinitionsComponent,
        UsersComponent,
        UserComponent,
        HumanNameComponent,
        HumanNamesComponent,
        NewProfileComponent,
        StringComponent,
        SelectChoiceModalComponent,
        ElementDefinitionPanelComponent,
        ElementDefinitionTypeModalComponent,
        MarkdownComponent,
        FhirMarkdownComponent,
        ReferenceComponent,
        PageComponentModalComponent,
        CapabilityStatementsComponent,
        CapabilityStatementWrapperComponent,
        STU3CapabilityStatementComponent,
        R4CapabilityStatementComponent,
        OperationDefinitionsComponent,
        OperationDefinitionComponent,
        MultiContactComponent,
        MultiUseContextComponent,
        MultiJurisdictionComponent,
        MaxCardinalityComponent,
        OperationDefinitionParameterModalComponent,
        BooleanComponent,
        FhirDateComponent,
        ValuesetExpandComponent,
        SelectSingleCodeComponent,
        MultiIdentifierComponent,
        SelectMultiCodingComponent,
        ContactModalComponent,
        IdentifierModalComponent,
        ChoiceComponent,
        MarkdownModalComponent,
        ValidationResultsComponent,
        FhirEditAddressModalComponent,
        QuantityComponent,
        IdentifierComponent,
        AttachmentComponent,
        FhirEditAttachmentModalComponent,
        FhirEditCodeableConceptModalComponent,
        FhirEditCodingModalComponent,
        FhirEditContactPointModalComponent,
        FhirEditHumanNameModalComponent,
        FhirEditPeriodComponent,
        FhirEditRangeComponent,
        FhirEditRangeModalComponent,
        FhirEditRatioComponent,
        FhirEditRatioModalComponent,
        FhirEditCodesystemConceptModalComponent,
        FhirEditCapabilityStatementResourceModalComponent,
        FhirEditMessagingEventModalComponent,
        FhirEditReferenceModalComponent,
        FileOpenModalComponent,
        NewUserModalComponent,
        ChangeResourceIdModalComponent,
        TooltipIconComponent,
        FhirEditValueSetIncludeConceptModalComponent,
        RawResourceComponent,
        ValuesetConceptCardComponent,
        ImplementationGuideViewComponent,
        OtherResourcesComponent,
        QuestionnairesComponent,
        QuestionnaireComponent,
        FhirEditPractitionerComponent
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes, {
                enableTracing: false,           // <-- debugging purposes only
                onSameUrlNavigation: 'reload'
            }
        ),
        BrowserModule,
        FormsModule,
        HttpClientModule,
        HttpModule,
        NgbModule.forRoot(),
        FileDropModule
    ],
    providers: [
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: getConfig,
            deps: [ConfigService],
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AddHeaderInterceptor,
            multi: true
        }, {
            provide: CookieService,
            useFactory: cookieServiceFactory
        },
        AuthService,
        PractitionerService,
        AuditEventService,
        RecentItemService,
        BinaryService,
        ValueSetService,
        CodeSystemService,
        FhirService,
        FileService,
        Globals,
        ImportService,
        ExportService,
        CapabilityStatementService,
        OperationDefinitionService,
        ImplementationGuideService,
        StructureDefinitionService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}