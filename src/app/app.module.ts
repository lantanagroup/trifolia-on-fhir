import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuidesComponent} from './implementation-guides/implementation-guides.component';
import {HomeComponent} from './home/home.component';
import {STU3ImplementationGuideComponent} from './implementation-guide-wrapper/stu3/implementation-guide.component';
import {R4ImplementationGuideComponent} from './implementation-guide-wrapper/r4/implementation-guide.component';
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
import {FhirHumanNameComponent} from './fhir-edit/human-name/human-name.component';
import {FhirHumanNamesComponent} from './fhir-edit/human-names/human-names.component';
import {NewProfileComponent} from './new-profile/new-profile.component';
import {CookieService} from 'angular2-cookie/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FhirStringComponent} from './fhir-edit/string/string.component';
import {SelectChoiceModalComponent} from './select-choice-modal/select-choice-modal.component';
import {ElementDefinitionPanelComponent} from './structure-definition/element-definition-panel/element-definition-panel.component';
import {STU3TypeModalComponent} from './structure-definition/element-definition-panel/stu3-type-modal/type-modal.component';
import {R4TypeModalComponent} from './structure-definition/element-definition-panel/r4-type-modal/type-modal.component';
import {MarkdownComponent} from './markdown/markdown.component';
import {AuditEventService} from './services/audit-event.service';
import {KeysPipe} from './pipes/keys-pipe';
import {FhirReferenceComponent} from './fhir-edit/reference/reference.component';
import {FhirDisplayPipe} from './pipes/fhir-display-pipe';
import {PageComponentModalComponent as STU3PageComponentModalComponent} from './implementation-guide-wrapper/stu3/page-component-modal.component';
import {PageComponentModalComponent as R4PageComponentModalComponent} from './implementation-guide-wrapper/r4/page-component-modal.component';
import {RecentItemService} from './services/recent-item.service';
import {BinaryService} from './services/binary.service';
import {CapabilityStatementsComponent} from './capability-statements/capability-statements.component';
import {OperationDefinitionsComponent} from './operation-definitions/operation-definitions.component';
import {OperationDefinitionComponent} from './operation-definition/operation-definition.component';
import {CapabilityStatementService} from './services/capability-statement.service';
import {OperationDefinitionService} from './services/operation-definition.service';
import {FhirMultiContactComponent} from './fhir-edit/multi-contact/multi-contact.component';
import {FhirMultiUseContextComponent} from './fhir-edit/multi-use-context/multi-use-context.component';
import {FhirMultiJurisdictionComponent} from './fhir-edit/multi-jurisdiction/multi-jurisdiction.component';
import {FhirMaxCardinalityComponent} from './fhir-edit/max-cardinality/max-cardinality.component';
import {ParameterModalComponent} from './operation-definition/parameter-modal/parameter-modal.component';
import {ValueSetService} from './services/value-set.service';
import {CodeSystemService} from './services/code-system.service';
import {FhirBooleanComponent} from './fhir-edit/boolean/boolean.component';
import {FhirMarkdownComponent} from './fhir-edit/markdown/markdown.component';
import {FhirDateComponent} from './fhir-edit/date/date.component';
import {ValuesetExpandComponent} from './valueset-expand/valueset-expand.component';
import {FhirSelectSingleCodeComponent} from './fhir-edit/select-single-code/select-single-code.component';
import {FhirMultiIdentifierComponent} from './fhir-edit/multi-identifier/multi-identifier.component';
import {FhirSelectMultiCodingComponent} from './fhir-edit/select-multi-coding/select-multi-coding.component';
import {FhirContactModalComponent} from './fhir-edit/contact-modal/contact-modal.component';
import {FhirIdentifierModalComponent} from './fhir-edit/identifier-modal/identifier-modal.component';
import {FhirChoiceComponent} from './fhir-edit/choice/choice.component';
import {MarkdownModalComponent} from './markdown-modal/markdown-modal.component';
import {ValidationResultsComponent} from './validation-results/validation-results.component';
import {FhirAddressModalComponent} from './fhir-edit/address-modal/address-modal.component';
import {FhirQuantityComponent} from './fhir-edit/quantity/quantity.component';
import {FhirIdentifierComponent} from './fhir-edit/identifier/identifier.component';
import {FhirAttachmentComponent} from './fhir-edit/attachment/attachment.component';
import {FhirAttachmentModalComponent} from './fhir-edit/attachment-modal/attachment-modal.component';
import {FhirCodeableConceptModalComponent} from './fhir-edit/codeable-concept-modal/codeable-concept-modal.component';
import {FhirCodingModalComponent} from './fhir-edit/coding-modal/coding-modal.component';
import {FhirContactPointModalComponent} from './fhir-edit/contact-point-modal/contact-point-modal.component';
import {FhirHumanNameModalComponent} from './fhir-edit/human-name-modal/human-name-modal.component';
import {FhirPeriodComponent} from './fhir-edit/period/period.component';
import {FhirRangeComponent} from './fhir-edit/range/range.component';
import {FhirRangeModalComponent} from './fhir-edit/range-modal/range-modal.component';
import {FhirRatioComponent} from './fhir-edit/ratio/ratio.component';
import {FhirRatioModalComponent} from './fhir-edit/ratio-modal/ratio-modal.component';
import {FhirCodesystemConceptModalComponent} from './fhir-edit/codesystem-concept-modal/codesystem-concept-modal.component';
import {FhirCapabilityStatementResourceModalComponent} from './fhir-edit/capability-statement-resource-modal/capability-statement-resource-modal.component';
import {FhirMessagingEventModalComponent} from './fhir-edit/messaging-event-modal/messaging-event-modal.component';
import {CapabilityStatementWrapperComponent} from './capability-statement-wrapper/capability-statement-wrapper.component';
import {STU3CapabilityStatementComponent} from './capability-statement-wrapper/stu3/capability-statement.component';
import {R4CapabilityStatementComponent} from './capability-statement-wrapper/r4/capability-statement.component';
import {XmlPipe} from './pipes/xml-pipe';
import {FileDropModule} from 'ngx-file-drop';
import {FhirReferenceModalComponent} from './fhir-edit/reference-modal/reference-modal.component';
import {FhirService} from './services/fhir.service';
import {FileService} from './services/file.service';
import {ConfigService} from './services/config.service';
import {FileOpenModalComponent} from './file-open-modal/file-open-modal.component';
import {ImplementationGuideService} from './services/implementation-guide.service';
import {StructureDefinitionService} from './services/structure-definition.service';
import {ImportService} from './services/import.service';
import {ExportService} from './services/export.service';
import {NewUserModalComponent} from './new-user-modal/new-user-modal.component';
import {ChangeResourceIdModalComponent} from './change-resource-id-modal/change-resource-id-modal.component';
import {FhirXmlPipe} from './pipes/fhir-xml-pipe';
import {TooltipIconComponent} from './tooltip-icon/tooltip-icon.component';
import {FhirValueSetIncludeConceptModalComponent} from './fhir-edit/value-set-include-concept-modal/value-set-include-concept-modal.component';
import {RawResourceComponent} from './raw-resource/raw-resource.component';
import {ConceptCardComponent} from './valueset/concept-card/concept-card.component';
import {ImplementationGuideViewComponent} from './implementation-guide-view/implementation-guide-view.component';
import {SafePipe} from './pipes/safe-pipe';
import {OtherResourcesComponent} from './other-resources/other-resources.component';
import {QuestionnairesComponent} from './questionnaires/questionnaires.component';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {FhirPractitionerComponent} from './fhir-edit/practitioner/practitioner.component';
import {SocketService} from './services/socket.service';
import {QuestionnaireItemModalComponent} from './questionnaire/questionnaire-item-modal.component';
import {ImplementationGuideWrapperComponent} from './implementation-guide-wrapper/implementation-guide-wrapper.component';
import {PublishedIgSelectModalComponent} from './published-ig-select-modal/published-ig-select-modal.component';
import {RouteTransformerDirective} from './route-transformer.directive';
import {ImplementationGuidesPanelComponent} from './structure-definition/implementation-guides-panel/implementation-guides-panel.component';
import {MappingModalComponent} from './structure-definition/element-definition-panel/mapping-modal/mapping-modal.component';
import {SettingsModalComponent} from './settings-modal/settings-modal.component';
import {ImportGithubPanelComponent} from './import/import-github-panel/import-github-panel.component';
import {TreeModule} from 'ng2-tree';
import {ExportGithubPanelComponent} from './export-github-panel/export-github-panel.component';
import {FhirEditNumberComponent} from './fhir-edit/number/number.component';
import {AdminMessageModalComponent} from './admin-message-modal/admin-message-modal.component';
import {ResourceHistoryComponent} from './resource-history/resource-history.component';
import {ContextPanelWrapperComponent} from './structure-definition/context-panel-wrapper/context-panel-wrapper.component';
import {ContextPanelR4Component} from './structure-definition/context-panel-wrapper/r4/context-panel-r4.component';
import {ContextPanelStu3Component} from './structure-definition/context-panel-wrapper/stu3/context-panel-stu3.component';
import {DiffMatchPatchModule} from 'ng-diff-match-patch';
import {PublishComponent} from './publish/publish.component';
import {NarrativeComponent} from './fhir-edit/narrative/narrative.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {IncludePanelComponent} from './valueset/include-panel/include-panel.component';
import {BindingPanelComponent} from './structure-definition/element-definition-panel/binding-panel/binding-panel.component';

export class AddHeaderInterceptor implements HttpInterceptor {
    constructor() {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const tokenExpiresAt = localStorage.getItem('expires_at');
        const token = tokenExpiresAt && new Date().getTime() < JSON.parse(tokenExpiresAt) ? localStorage.getItem('token') : undefined;
        const fhirServer = localStorage.getItem('fhirServer');
        const headers = {};

        if (req.url.startsWith('/')) {
            if (token) {
                headers['Authorization'] = 'Bearer ' + token;
            }

            if (fhirServer) {
                headers['fhirServer'] = fhirServer;
            }

            headers['Cache-Control'] = 'no-cache';
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
    {path: 'implementation-guide/new', component: ImplementationGuideWrapperComponent},
    {path: 'implementation-guide/:id/view', component: ImplementationGuideViewComponent, runGuardsAndResolvers: 'always'},
    {path: 'implementation-guide/:id', component: ImplementationGuideWrapperComponent, runGuardsAndResolvers: 'always'},
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
    {path: 'publish', component: PublishComponent},
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
        AdminMessageModalComponent, SelectChoiceModalComponent, STU3TypeModalComponent, R4TypeModalComponent,
        STU3PageComponentModalComponent, R4PageComponentModalComponent, ParameterModalComponent,
        FhirContactModalComponent, FhirIdentifierModalComponent, MarkdownModalComponent, FhirAddressModalComponent,
        FhirAttachmentModalComponent, FhirCodeableConceptModalComponent, FhirCodingModalComponent,
        FhirContactPointModalComponent, FhirHumanNameModalComponent, FhirRangeModalComponent, FhirRatioModalComponent,
        FhirCodesystemConceptModalComponent, FhirCapabilityStatementResourceModalComponent,
        FhirMessagingEventModalComponent, STU3CapabilityStatementComponent, R4CapabilityStatementComponent,
        FhirReferenceModalComponent, FileOpenModalComponent, NewUserModalComponent, ChangeResourceIdModalComponent,
        FhirValueSetIncludeConceptModalComponent, QuestionnaireItemModalComponent, STU3ImplementationGuideComponent,
        R4ImplementationGuideComponent, PublishedIgSelectModalComponent, MappingModalComponent, SettingsModalComponent,
        ContextPanelStu3Component, ContextPanelR4Component
    ],
    declarations: [
        AppComponent, KeysPipe, FhirDisplayPipe, FhirXmlPipe, SafePipe, XmlPipe, ImplementationGuidesComponent,
        HomeComponent, STU3ImplementationGuideComponent, R4ImplementationGuideComponent, ExportComponent,
        ImportComponent, StructureDefinitionComponent, ValuesetsComponent, ValuesetComponent, CodesystemsComponent,
        CodesystemComponent, LoginComponent, StructureDefinitionsComponent, UsersComponent, UserComponent,
        FhirHumanNameComponent, FhirHumanNamesComponent, NewProfileComponent, FhirStringComponent,
        SelectChoiceModalComponent, ElementDefinitionPanelComponent, STU3TypeModalComponent, R4TypeModalComponent,
        MarkdownComponent, FhirMarkdownComponent, FhirReferenceComponent, STU3PageComponentModalComponent,
        R4PageComponentModalComponent, CapabilityStatementsComponent, CapabilityStatementWrapperComponent,
        STU3CapabilityStatementComponent, R4CapabilityStatementComponent, OperationDefinitionsComponent,
        OperationDefinitionComponent, FhirMultiContactComponent, FhirMultiUseContextComponent,
        FhirMultiJurisdictionComponent, FhirMaxCardinalityComponent, ParameterModalComponent, FhirBooleanComponent,
        FhirDateComponent, ValuesetExpandComponent, FhirSelectSingleCodeComponent, FhirMultiIdentifierComponent,
        FhirSelectMultiCodingComponent, FhirContactModalComponent, FhirIdentifierModalComponent, FhirChoiceComponent,
        MarkdownModalComponent, ValidationResultsComponent, FhirAddressModalComponent, FhirQuantityComponent,
        FhirIdentifierComponent, FhirAttachmentComponent, FhirAttachmentModalComponent,
        FhirCodeableConceptModalComponent, FhirCodingModalComponent, FhirContactPointModalComponent,
        FhirHumanNameModalComponent, FhirPeriodComponent, FhirRangeComponent, FhirRangeModalComponent,
        FhirRatioComponent, FhirRatioModalComponent, FhirCodesystemConceptModalComponent,
        FhirCapabilityStatementResourceModalComponent, FhirMessagingEventModalComponent, FhirReferenceModalComponent,
        FileOpenModalComponent, NewUserModalComponent, ChangeResourceIdModalComponent, TooltipIconComponent,
        FhirValueSetIncludeConceptModalComponent, RawResourceComponent, ConceptCardComponent,
        ImplementationGuideViewComponent, OtherResourcesComponent, QuestionnairesComponent, QuestionnaireComponent,
        FhirPractitionerComponent, QuestionnaireItemModalComponent, ImplementationGuideWrapperComponent,
        PublishedIgSelectModalComponent, RouteTransformerDirective, ImplementationGuidesPanelComponent,
        MappingModalComponent, SettingsModalComponent, ImportGithubPanelComponent, ExportGithubPanelComponent,
        FhirEditNumberComponent, AdminMessageModalComponent, ResourceHistoryComponent, ContextPanelWrapperComponent,
        ContextPanelR4Component, ContextPanelStu3Component, PublishComponent, NarrativeComponent, IncludePanelComponent, BindingPanelComponent
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
        FileDropModule,
        TreeModule,
        DiffMatchPatchModule,
        AngularEditorModule
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
        ImportService,
        ExportService,
        CapabilityStatementService,
        OperationDefinitionService,
        ImplementationGuideService,
        StructureDefinitionService,
        SocketService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}