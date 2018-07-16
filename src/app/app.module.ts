import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
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
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {StructureDefinitionsComponent} from './structure-definitions/structure-definitions.component';
import {UsersComponent} from './users/users.component';
import {UserComponent} from './user/user.component';
import {AuthService} from './services/auth.service';
import {PersonService} from './services/person.service';
import {HumanNameComponent} from './fhir-edit/human-name/human-name.component';
import {HumanNamesComponent} from './fhir-edit/human-names/human-names.component';
import {NewProfileComponent} from './new-profile/new-profile.component';
import {CookieService} from 'angular2-cookie/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {StringComponent} from './fhir-edit/string/string.component';
import {SelectChoiceModalComponent} from './select-choice-modal/select-choice-modal.component';
import {ElementDefinitionPanelComponent} from './element-definition-panel/element-definition-panel.component';
import {ElementDefinitionTypeModalComponent} from './fhir-edit/element-definition-type-modal/element-definition-type-modal.component';
import {Globals} from './globals';
import {MarkdownComponent} from './markdown/markdown.component';
import {TJsonViewerModule} from 't-json-viewer';
import {AuditEventService} from './services/audit-event.service';
import {KeysPipe} from './pipes/keys-pipe';
import {ReferenceComponent} from './fhir-edit/reference/reference.component';
import {FhirDisplayPipe} from './pipes/fhir-display-pipe';
import {PageComponentModalComponent} from './fhir-edit/page-component-modal/page-component-modal.component';
import {RecentItemService} from './services/recent-item.service';
import {BinaryService} from './services/binary.service';
import { CapabilityStatementsComponent } from './capability-statements/capability-statements.component';
import { CapabilityStatementComponent } from './capability-statement/capability-statement.component';
import { OperationDefinitionsComponent } from './operation-definitions/operation-definitions.component';
import { OperationDefinitionComponent } from './operation-definition/operation-definition.component';
import {CapabilityStatementService} from './services/capability-statement.service';
import {OperationDefinitionService} from './services/operation-definition.service';
import { MultiContactComponent } from './fhir-edit/multi-contact/multi-contact.component';
import { MultiUseContextComponent } from './fhir-edit/multi-use-context/multi-use-context.component';
import { MultiJurisdictionComponent } from './fhir-edit/multi-jurisdiction/multi-jurisdiction.component';
import { MaxCardinalityComponent } from './fhir-edit/max-cardinality/max-cardinality.component';
import { OperationDefinitionParameterModalComponent } from './operation-definition-parameter-modal/operation-definition-parameter-modal.component';
import {ValueSetService} from './services/value-set.service';
import {CodeSystemService} from './services/code-system.service';
import { BooleanComponent } from './fhir-edit/boolean/boolean.component';
import {FhirMarkdownComponent} from './fhir-edit/markdown/markdown.component';
import { FhirDateComponent } from './fhir-edit/date/date.component';
import { ValuesetIncludeModalComponent } from './valueset-include-modal/valueset-include-modal.component';
import { ValuesetExpandComponent } from './valueset-expand/valueset-expand.component';
import { SelectSingleCodeComponent } from './fhir-edit/select-single-code/select-single-code.component';
import { MultiIdentifierComponent } from './fhir-edit/multi-identifier/multi-identifier.component';
import { SelectMultiCodingComponent } from './fhir-edit/select-multi-coding/select-multi-coding.component';
import { ContactModalComponent } from './fhir-edit/contact-modal/contact-modal.component';
import { IdentifierModalComponent } from './fhir-edit/identifier-modal/identifier-modal.component';
import { ChoiceComponent } from './fhir-edit/choice/choice.component';
import { MarkdownModalComponent } from './markdown-modal/markdown-modal.component';
import { ValidationResultsComponent } from './validation-results/validation-results.component';
import { AddressModalComponent } from './address-modal/address-modal.component';
import { QuantityComponent } from './fhir-edit/quantity/quantity.component';
import { IdentifierComponent } from './fhir-edit/identifier/identifier.component';
import { AttachmentComponent } from './fhir-edit/attachment/attachment.component';
import { FhirEditAttachmentModalComponent } from './fhir-edit/attachment-modal/attachment-modal.component';
import { FhirEditCodeableConceptModalComponent } from './fhir-edit/codeable-concept-modal/codeable-concept-modal.component';
import { FhirEditCodingModalComponent } from './fhir-edit/coding-modal/coding-modal.component';
import { FhirEditContactPointModalComponent } from './fhir-edit/contact-point-modal/contact-point-modal.component';
import { FhirEditHumanNameModalComponent } from './fhir-edit/human-name-modal/human-name-modal.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
        noClientCheck: true
    }), http, options);
}

export class AddHeaderInterceptor implements HttpInterceptor {
    constructor() {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');
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

const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'implementation-guide', component: ImplementationGuidesComponent},
    {path: 'implementation-guide/new', component: ImplementationGuideComponent},
    {path: 'implementation-guide/:id', component: ImplementationGuideComponent},
    {path: 'structure-definition', component: StructureDefinitionsComponent},
    {path: 'structure-definition/new', component: NewProfileComponent},
    {path: 'structure-definition/:id', component: StructureDefinitionComponent},
    {path: 'capability-statement', component: CapabilityStatementsComponent},
    {path: 'capability-statement/new', component: CapabilityStatementComponent},
    {path: 'capability-statement/:id', component: CapabilityStatementComponent},
    {path: 'operation-definition', component: OperationDefinitionsComponent},
    {path: 'operation-definition/new', component: OperationDefinitionComponent},
    {path: 'operation-definition/:id', component: OperationDefinitionComponent},
    {path: 'value-set', component: ValuesetsComponent},
    {path: 'value-set/:id', component: ValuesetComponent},
    {path: 'value-set/:id/expand', component: ValuesetExpandComponent},
    {path: 'code-system', component: CodesystemsComponent},
    {path: 'code-system/:id', component: CodesystemComponent},
    {path: 'export', component: ExportComponent},
    {path: 'import', component: ImportComponent},
    {path: 'users', component: UsersComponent},
    {path: 'users/me', component: UserComponent},
    {path: 'users/:id', component: UserComponent},
    {path: 'login', component: LoginComponent},
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

@NgModule({
    entryComponents: [
        SelectChoiceModalComponent,
        ElementDefinitionTypeModalComponent,
        PageComponentModalComponent,
        OperationDefinitionParameterModalComponent,
        ValuesetIncludeModalComponent,
        ContactModalComponent,
        IdentifierModalComponent,
        MarkdownModalComponent,
        AddressModalComponent,
        FhirEditAttachmentModalComponent,
        FhirEditCodeableConceptModalComponent,
        FhirEditCodingModalComponent,
        FhirEditContactPointModalComponent,
        FhirEditHumanNameModalComponent
    ],
    declarations: [
        AppComponent,
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
        KeysPipe,
        FhirDisplayPipe,
        ReferenceComponent,
        PageComponentModalComponent,
        CapabilityStatementsComponent,
        CapabilityStatementComponent,
        OperationDefinitionsComponent,
        OperationDefinitionComponent,
        MultiContactComponent,
        MultiUseContextComponent,
        MultiJurisdictionComponent,
        MaxCardinalityComponent,
        OperationDefinitionParameterModalComponent,
        BooleanComponent,
        FhirDateComponent,
        ValuesetIncludeModalComponent,
        ValuesetExpandComponent,
        SelectSingleCodeComponent,
        MultiIdentifierComponent,
        SelectMultiCodingComponent,
        ContactModalComponent,
        IdentifierModalComponent,
        ChoiceComponent,
        MarkdownModalComponent,
        ValidationResultsComponent,
        AddressModalComponent,
        QuantityComponent,
        IdentifierComponent,
        AttachmentComponent,
        FhirEditAttachmentModalComponent,
        FhirEditCodeableConceptModalComponent,
        FhirEditCodingModalComponent,
        FhirEditContactPointModalComponent,
        FhirEditHumanNameModalComponent
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {enableTracing: false} // <-- debugging purposes only
        ),
        BrowserModule,
        FormsModule,
        HttpClientModule,
        HttpModule,
        NgbModule.forRoot(),
        TJsonViewerModule
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        }, {
            provide: HTTP_INTERCEPTORS,
            useClass: AddHeaderInterceptor,
            multi: true
        },
        AuthService,
        PersonService,
        CookieService,
        AuditEventService,
        RecentItemService,
        BinaryService,
        CapabilityStatementService,
        OperationDefinitionService,
        ValueSetService,
        CodeSystemService,
        Globals
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}