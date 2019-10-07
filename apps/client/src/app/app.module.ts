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
import {NewProfileComponent} from './new-profile/new-profile.component';
import {CookieService} from 'angular2-cookie/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ElementDefinitionPanelComponent} from './structure-definition/element-definition-panel/element-definition-panel.component';
import {STU3TypeModalComponent} from './structure-definition/element-definition-panel/stu3-type-modal/type-modal.component';
import {R4TypeModalComponent} from './structure-definition/element-definition-panel/r4-type-modal/type-modal.component';
import {PageComponentModalComponent as STU3PageComponentModalComponent} from './implementation-guide-wrapper/stu3/page-component-modal.component';
import {PageComponentModalComponent as R4PageComponentModalComponent} from './implementation-guide-wrapper/r4/page-component-modal.component';
import {CapabilityStatementsComponent} from './capability-statements/capability-statements.component';
import {OperationDefinitionsComponent} from './operation-definitions/operation-definitions.component';
import {OperationDefinitionComponent} from './operation-definition/operation-definition.component';
import {ParameterModalComponent} from './operation-definition/parameter-modal/parameter-modal.component';
import {ValuesetExpandComponent} from './valueset-expand/valueset-expand.component';
import {CapabilityStatementWrapperComponent} from './capability-statement-wrapper/capability-statement-wrapper.component';
import {STU3CapabilityStatementComponent} from './capability-statement-wrapper/stu3/capability-statement.component';
import {R4CapabilityStatementComponent} from './capability-statement-wrapper/r4/capability-statement.component';
import {FileDropModule} from 'ngx-file-drop';
import {ConfigService} from './shared/config.service';
import {ConceptCardComponent} from './valueset/concept-card/concept-card.component';
import {ImplementationGuideViewComponent} from './implementation-guide-view/implementation-guide-view.component';
import {OtherResourcesComponent} from './other-resources/other-resources.component';
import {QuestionnairesComponent} from './questionnaires/questionnaires.component';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {QuestionnaireItemModalComponent} from './questionnaire/questionnaire-item-modal.component';
import {ImplementationGuideWrapperComponent} from './implementation-guide-wrapper/implementation-guide-wrapper.component';
import {RouteTransformerDirective} from './route-transformer.directive';
import {ImplementationGuidesPanelComponent} from './structure-definition/implementation-guides-panel/implementation-guides-panel.component';
import {MappingModalComponent} from './structure-definition/element-definition-panel/mapping-modal/mapping-modal.component';
import {ImportGithubPanelComponent} from './import/import-github-panel/import-github-panel.component';
import {TreeModule} from 'ng2-tree';
import {ExportGithubPanelComponent} from './export-github-panel/export-github-panel.component';
import {ContextPanelWrapperComponent} from './structure-definition/context-panel-wrapper/context-panel-wrapper.component';
import {ContextPanelR4Component} from './structure-definition/context-panel-wrapper/r4/context-panel-r4.component';
import {ContextPanelStu3Component} from './structure-definition/context-panel-wrapper/stu3/context-panel-stu3.component';
import {PublishComponent} from './publish/publish.component';
import {IncludePanelComponent} from './valueset/include-panel/include-panel.component';
import {BindingPanelComponent} from './structure-definition/element-definition-panel/binding-panel/binding-panel.component';
import {SharedModule} from './shared/shared.module';
import {FhirEditModule} from './fhir-edit/fhir-edit.module';
import {ModalsModule} from './modals/modals.module';
import {SharedUiModule} from './shared-ui/shared-ui.module';
import {AuthService} from './shared/auth.service';
import {FhirService} from './shared/fhir.service';
import { OAuthModule, AuthConfig, JwksValidationHandler, ValidationHandler, OAuthStorage, OAuthModuleConfig } from 'angular-oauth2-oidc';

//OSP: Added in move fra Auth0 to angular-oauth2-oidc
import { OAuthModule, AuthConfig, JwksValidationHandler, ValidationHandler, OAuthStorage, OAuthModuleConfig } from 'angular-oauth2-oidc'; // Added

/**
 * This class is an HTTP interceptor that is responsible for adding an
 * Authorization header to every request sent to the application server.
 */
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
    }

    if (req.url.startsWith('/api/')) {
      headers['Cache-Control'] = 'no-cache';

      if (fhirServer) {
        headers['fhirServer'] = fhirServer;
      }
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

/**
 * The routes in the client application.
 */
const appRoutes: Routes = [
  {path: ':fhirServer/home', component: HomeComponent},
  {path: ':fhirServer/implementation-guide', component: ImplementationGuidesComponent},
  {path: ':fhirServer/implementation-guide/new', component: ImplementationGuideWrapperComponent},
  {path: ':fhirServer/implementation-guide/:id/view', component: ImplementationGuideViewComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/implementation-guide/:id', component: ImplementationGuideWrapperComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/structure-definition', component: StructureDefinitionsComponent},
  {path: ':fhirServer/structure-definition/new', component: NewProfileComponent},
  {path: ':fhirServer/structure-definition/:id', component: StructureDefinitionComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/capability-statement', component: CapabilityStatementsComponent},
  {path: ':fhirServer/capability-statement/new', component: CapabilityStatementWrapperComponent},
  {path: ':fhirServer/capability-statement/:id', component: CapabilityStatementWrapperComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/operation-definition', component: OperationDefinitionsComponent},
  {path: ':fhirServer/operation-definition/new', component: OperationDefinitionComponent},
  {path: ':fhirServer/operation-definition/:id', component: OperationDefinitionComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/value-set', component: ValuesetsComponent},
  {path: ':fhirServer/value-set/:id', component: ValuesetComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/value-set/:id/expand', component: ValuesetExpandComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/code-system', component: CodesystemsComponent},
  {path: ':fhirServer/code-system/:id', component: CodesystemComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/questionnaire', component: QuestionnairesComponent},
  {path: ':fhirServer/questionnaire/new', component: QuestionnaireComponent},
  {path: ':fhirServer/questionnaire/:id', component: QuestionnaireComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/other-resources', component: OtherResourcesComponent},
  {path: ':fhirServer/publish', component: PublishComponent},
  {path: ':fhirServer/publish/:id', component: PublishComponent, runGuardsAndResolvers: 'always'},
  {path: ':fhirServer/export', component: ExportComponent},
  {path: ':fhirServer/import', component: ImportComponent},
  {path: ':fhirServer/users', component: UsersComponent},
  {path: ':fhirServer/users/me', component: UserComponent},
  {path: ':fhirServer/users/:id', component: UserComponent, runGuardsAndResolvers: 'always'},
  {path: 'login', component: LoginComponent}
];

/**
 * Initialization logic.
 * 1. Gets the client application's config from the server
 * 2. Initialization authentication and handles an authentication request callback (if there is one)
 * 3. Loads assets for the remembered version of the FHIR server
 * 4. Gets the profile o f the currently logged-in user, if there is one
 */
export function init(configService: ConfigService, authService: AuthService, fhirService: FhirService) {
  const getConfig = () => {
    return new Promise((resolve, reject) => {
      // Get the initial config for the server and get the FHIR server config
      configService.getConfig(true)
        .then(() => {
          // Notify components and the FHIR server has changed (or in this case, has been loaded)
          return configService.changeFhirServer();
        })
        .then(() => {
          // Now that the config has been loaded, init the auth module
          authService.init();
          authService.handleAuthentication();

          // Load FHIR assets (profiles, value sets, etc.)
          return fhirService.loadAssets();
        })
        .then(() => {
          // The FHIR server should now be loaded, get the profile for the authenticated user (if any)
          return authService.getProfile();
        })
        .then(() => resolve())              // Done
        .catch((err) => reject(err));       // Error
    });
  };

  // First, get the config, which triggers a chain of other requests to initialize
  return () => getConfig();
}

const authModuleConfig: OAuthModuleConfig = {
  // Inject "Authorization: Bearer ..." header for these APIs:
  resourceServer: {
    allowedUrls: [],
    sendAccessToken: true,
  },
};

@NgModule({
  entryComponents: [
    STU3TypeModalComponent, R4TypeModalComponent, STU3PageComponentModalComponent, R4PageComponentModalComponent,
    ParameterModalComponent, STU3CapabilityStatementComponent, R4CapabilityStatementComponent,
    QuestionnaireItemModalComponent, STU3ImplementationGuideComponent, R4ImplementationGuideComponent,
    MappingModalComponent, ContextPanelStu3Component, ContextPanelR4Component
  ],
  declarations: [
    AppComponent, ImplementationGuidesComponent,
    HomeComponent, STU3ImplementationGuideComponent, R4ImplementationGuideComponent, ExportComponent,
    ImportComponent, StructureDefinitionComponent, ValuesetsComponent, ValuesetComponent, CodesystemsComponent,
    CodesystemComponent, LoginComponent, StructureDefinitionsComponent, UsersComponent, UserComponent,
    NewProfileComponent, ElementDefinitionPanelComponent, STU3TypeModalComponent, R4TypeModalComponent,
    STU3PageComponentModalComponent, R4PageComponentModalComponent, CapabilityStatementsComponent,
    CapabilityStatementWrapperComponent, STU3CapabilityStatementComponent, R4CapabilityStatementComponent,
    OperationDefinitionsComponent, OperationDefinitionComponent, ParameterModalComponent, ValuesetExpandComponent,
    ConceptCardComponent, ImplementationGuideViewComponent,
    OtherResourcesComponent, QuestionnairesComponent, QuestionnaireComponent, QuestionnaireItemModalComponent,
    ImplementationGuideWrapperComponent, RouteTransformerDirective, ImplementationGuidesPanelComponent,
    MappingModalComponent, ImportGithubPanelComponent, ExportGithubPanelComponent, ContextPanelWrapperComponent, ContextPanelR4Component,
    ContextPanelStu3Component, PublishComponent, IncludePanelComponent, BindingPanelComponent
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
    OAuthModule.forRoot(authModuleConfig),
    HttpModule,
    NgbModule.forRoot(),
    FileDropModule,
    TreeModule,
    SharedModule,
    SharedUiModule,
    FhirEditModule,
    ModalsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [ConfigService, AuthService, FhirService],
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
    {
      provide: OAuthModuleConfig,
      useValue: authModuleConfig
    },
    {
      provide: ValidationHandler,
      useClass: JwksValidationHandler
    },
    {
      provide: OAuthStorage,
      useValue: localStorage
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
