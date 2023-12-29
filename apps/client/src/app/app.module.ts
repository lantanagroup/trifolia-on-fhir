import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injectable, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
// noinspection JSDeprecatedSymbols
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImplementationGuidesComponent } from './implementation-guides/implementation-guides.component';
import { HomeComponent } from './home/home.component';
import { STU3ImplementationGuideComponent } from './implementation-guide-wrapper/stu3/implementation-guide.component';
import { R4ImplementationGuideComponent } from './implementation-guide-wrapper/r4/implementation-guide.component';
import { RouterModule, Routes } from '@angular/router';
import { ExportComponent } from './export/export.component';
import { ImportComponent } from './import/import.component';
import { StructureDefinitionComponent } from './structure-definition/structure-definition.component';
import { ValuesetsComponent } from './valuesets/valuesets.component';
import { ValuesetComponent } from './valueset/valueset.component';
import { CodesystemsComponent } from './codesystems/codesystems.component';
import { CodesystemComponent } from './codesystem/codesystem.component';
import { LoginComponent } from './login/login.component';
import { StructureDefinitionsComponent } from './structure-definitions/structure-definitions.component';
import { UserComponent } from './user/user.component';
import { NewProfileComponent } from './new-profile/new-profile.component';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElementDefinitionPanelComponent } from './structure-definition/element-definition-panel/element-definition-panel.component';
import { STU3TypeModalComponent } from './structure-definition/element-definition-panel/stu3-type-modal/type-modal.component';
import { R4TypeModalComponent } from './structure-definition/element-definition-panel/r4-type-modal/type-modal.component';
import { PageComponentModalComponent as STU3PageComponentModalComponent } from './implementation-guide-wrapper/stu3/page-component-modal.component';
import { PageComponentModalComponent as R4PageComponentModalComponent } from './implementation-guide-wrapper/r4/page-component-modal.component';
import { PageComponentModalComponent as R5PageComponentModalComponent } from './implementation-guide-wrapper/r5/page-component-modal.component';
import { CapabilityStatementsComponent } from './capability-statements/capability-statements.component';
import { OperationDefinitionsComponent } from './operation-definitions/operation-definitions.component';
import { OperationDefinitionComponent } from './operation-definition/operation-definition.component';
import { ParameterModalComponent } from './operation-definition/parameter-modal/parameter-modal.component';
import { ValuesetExpandComponent } from './valueset-expand/valueset-expand.component';
import { CapabilityStatementWrapperComponent } from './capability-statement-wrapper/capability-statement-wrapper.component';
import { STU3CapabilityStatementComponent } from './capability-statement-wrapper/stu3/capability-statement.component';
import { R4CapabilityStatementComponent } from './capability-statement-wrapper/r4/capability-statement.component';
import { R5CapabilityStatementComponent } from './capability-statement-wrapper/r5/capability-statement.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ConfigService } from './shared/config.service';
import { ConceptCardComponent } from './valueset/concept-card/concept-card.component';
import { ImplementationGuideViewComponent } from './implementation-guide-view/implementation-guide-view.component';
import { OtherResourcesComponent } from './other-resources/other-resources.component';
import { QuestionnairesComponent } from './questionnaires/questionnaires.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { QuestionnaireItemModalComponent } from './questionnaire/questionnaire-item-modal.component';
import { ImplementationGuideWrapperComponent } from './implementation-guide-wrapper/implementation-guide-wrapper.component';
import { RouteTransformerDirective } from './route-transformer.directive';
import { MappingModalComponent } from './structure-definition/element-definition-panel/mapping-modal/mapping-modal.component';
import { ImportGithubPanelComponent } from './import/import-github-panel/import-github-panel.component';
// import { TreeModule } from 'ng2-tree';
import { ExportGithubPanelComponent } from './export-github-panel/export-github-panel.component';
import { ContextPanelWrapperComponent } from './structure-definition/context-panel-wrapper/context-panel-wrapper.component';
import { ContextPanelR4Component } from './structure-definition/context-panel-wrapper/r4/context-panel-r4.component';
import { ContextPanelStu3Component } from './structure-definition/context-panel-wrapper/stu3/context-panel-stu3.component';
import { PublishComponent } from './publish/publish.component';
import { IncludePanelComponent } from './valueset/include-panel/include-panel.component';
import { BindingPanelComponent } from './structure-definition/element-definition-panel/binding-panel/binding-panel.component';
import { SharedModule } from './shared/shared.module';
import { FhirEditModule } from './fhir-edit/fhir-edit.module';
import { ModalsModule } from './modals/modals.module';
import { SharedUiModule } from './shared-ui/shared-ui.module';
import { AuthService } from './shared/auth.service';
import { FhirService } from './shared/fhir.service';
import { R4ResourceModalComponent } from './implementation-guide-wrapper/r4/resource-modal.component';
import { STU3ResourceModalComponent } from './implementation-guide-wrapper/stu3/resource-modal.component';
import { OAuthModule, OAuthModuleConfig, OAuthService, OAuthStorage, ValidationHandler } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { UsersComponent } from './manage/users/users.component';
import { GroupModalComponent } from './implementation-guide-wrapper/r4/group-modal.component';
import { OtherResourcesResultComponent } from './other-resources/other-resources-result/other-resources-result.component';
import { PackageListComponent } from './implementation-guide-wrapper/package-list/package-list.component';
import { ResourceGuard } from './guards/resource.guard';
import { ElementDefinitionConstraintComponent } from './modals/element-definition-constraint/element-definition-constraint.component';
import { UpdateDiffComponent } from './import/update-diff/update-diff.component';
import { InlineDiffComponent } from 'ngx-diff';
import { QueueComponent } from './manage/queue/queue.component';
import { ExamplesComponent } from './examples/examples.component';
import { BulkEditComponent } from './bulk-edit/bulk-edit.component';
import { PageWrapperComponent } from './bulk-edit/page-wrapper/page-wrapper.component';
import { R4PageComponent } from './bulk-edit/page-wrapper/r4-page/r4-page.component';
import { STU3PageComponent } from './bulk-edit/page-wrapper/stu3-page/stu3-page.component';
import { IgnoreWarningsComponent } from './implementation-guide-wrapper/ignore-warnings/ignore-warnings.component';
import { JiraSpecComponent } from './implementation-guide-wrapper/jira-spec/jira-spec.component';
import { CustomMenuComponent } from './implementation-guide-wrapper/custom-menu/custom-menu.component';
import { SecurityServicesComponent } from './capability-statement-wrapper/security-services/security-services.component';
import { PublishingTemplateComponent } from './implementation-guide-wrapper/publishing-template/publishing-template.component';
import { MergeUserModalComponent } from './manage/merge-user-modal/merge-user-modal.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { SearchParameterComponent } from './search-parameter/search-parameter.component';
import { SearchParametersComponent } from './search-parameters/search-parameters.component';
import { PublishingRequestComponent } from './implementation-guide-wrapper/publishing-request/publishing-request.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import {R5ImplementationGuideComponent} from './implementation-guide-wrapper/r5/implementation-guide.component';
import {R5ResourceModalComponent} from './implementation-guide-wrapper/r5/resource-modal.component';
import {PagesComponent} from './pages/pages.component';
import {PageComponent} from './page/page.component';
import { AuditComponent } from './manage/audit/audit.component';
import {WorkGroupComponent} from './implementation-guide-wrapper/work-group/work-group.component';
import {TemplateComponent} from './implementation-guide-wrapper/template/template.component';

/**
 * This class is an HTTP interceptor that is responsible for adding an
 * Authorization header to every request sent to the application server.
 */
@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {
  constructor(
    private configService: ConfigService,
    private oauthService: OAuthService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers = req.headers;

    if (req.url.startsWith('/')) {
      if (this.oauthService.getIdToken()) {
        headers = headers.set(
          'Authorization',
          'Bearer ' + this.oauthService.getIdToken()
        );
      }
    }

    if (req.url.startsWith('/api/')) {
      headers = headers.set('Cache-Control', 'no-cache');

      // Pass the implementation guide (project) to the request so that it knows this request
      // is within the context of the project
      if (
        this.configService.igContext &&
        this.configService.igContext.implementationGuideId
      ) {
        headers = headers.set(
          'implementationGuideId',
          this.configService.igContext.implementationGuideId
        );
        headers = headers.set(
          'fhirversion',
          this.configService.fhirVersion
        );
      }

      // Remove the context if the request indicates the context should be ignored
      if (
        headers.get('ignoreContext') &&
        headers.get('implementationGuideId')
      ) {
        headers = headers.delete('implementationGuideId');
        headers = headers.delete('ignoreContext');
      }
    }

    return next.handle(req.clone({ headers: headers }));
  }
}

/**
 * The routes in the client application.
 */
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/new', component: NewProjectComponent },
  { path: 'projects/home', component: HomeComponent },
  { path: 'projects/:projectId', component: ProjectComponent },
  { path: 'projects/:implementationGuideId/implementation-guide', component: ImplementationGuideWrapperComponent, runGuardsAndResolvers: 'always', canDeactivate: [ResourceGuard] },
  { path: 'projects/:implementationGuideId/home', component: HomeComponent },
  { path: 'projects/implementation-guide/open', component: ImplementationGuidesComponent },
  { path: 'projects/:implementationGuideId/implementation-guide/view', component: ImplementationGuideViewComponent, runGuardsAndResolvers: 'always' },
  { path: 'projects/:implementationGuideId/code-system', component: CodesystemsComponent },
  { path: 'projects/:implementationGuideId/code-system/:id', component: CodesystemComponent, runGuardsAndResolvers: 'always' },
  { path: 'projects/:implementationGuideId/page', component: PagesComponent },
  { path: 'projects/:implementationGuideId/page/:id', component: PageComponent, runGuardsAndResolvers: 'always' },
  { path: 'projects/:implementationGuideId/page/new', component: PageComponent},
  { path: 'projects/:implementationGuideId/search-parameter', component: SearchParametersComponent },
  { path: 'projects/:implementationGuideId/search-parameter/new', component: SearchParameterComponent },
  { path: 'projects/:implementationGuideId/search-parameter/:id', component: SearchParameterComponent },

  { path: 'projects/:implementationGuideId/structure-definition', component: StructureDefinitionsComponent },
  { path: 'projects/:implementationGuideId/structure-definition/new', component: NewProfileComponent },
  { path: 'projects/:implementationGuideId/structure-definition/:id', component: StructureDefinitionComponent, runGuardsAndResolvers: 'always', canDeactivate: [ResourceGuard] },
  { path: 'projects/:implementationGuideId/capability-statement', component: CapabilityStatementsComponent },
  { path: 'projects/:implementationGuideId/capability-statement/new', component: CapabilityStatementWrapperComponent },
  { path: 'projects/:implementationGuideId/capability-statement/:id', component: CapabilityStatementWrapperComponent, runGuardsAndResolvers: 'always' },
  { path: 'projects/:implementationGuideId/operation-definition', component: OperationDefinitionsComponent },
  { path: 'projects/:implementationGuideId/operation-definition/new', component: OperationDefinitionComponent },
  { path: 'projects/:implementationGuideId/operation-definition/:id', component: OperationDefinitionComponent, runGuardsAndResolvers: 'always' },
  { path: 'projects/:implementationGuideId/value-set', component: ValuesetsComponent },
  { path: 'projects/:implementationGuideId/value-set/:id', component: ValuesetComponent, runGuardsAndResolvers: 'always' , canDeactivate: [ResourceGuard]},
  { path: 'projects/:implementationGuideId/value-set/:id/expand', component: ValuesetExpandComponent, runGuardsAndResolvers: 'always' },

  { path: 'projects/:implementationGuideId/questionnaire', component: QuestionnairesComponent },
  { path: 'projects/:implementationGuideId/questionnaire/new', component: QuestionnaireComponent },
  { path: 'projects/:implementationGuideId/questionnaire/:id', component: QuestionnaireComponent, runGuardsAndResolvers: 'always' },
  { path: 'projects/:implementationGuideId/publish', component: PublishComponent },
  { path: 'projects/:implementationGuideId/export', component: ExportComponent },
  { path: 'projects/:implementationGuideId/import', component: ImportComponent },
  { path: 'projects/:implementationGuideId/other-resources', component: OtherResourcesComponent },
  { path: 'projects/:implementationGuideId/other-resources/:type/:id', component: OtherResourcesResultComponent },
  { path: 'projects/:implementationGuideId/examples', component: ExamplesComponent },
  { path: 'projects/:implementationGuideId/bulk-edit', component: BulkEditComponent },

  { path: 'users/me', component: UserComponent },
  { path: 'users/:id', component: UserComponent, runGuardsAndResolvers: 'always' },
  { path: 'manage/audit', component: AuditComponent, runGuardsAndResolvers: 'always' },
  { path: 'manage/user', component: UsersComponent, runGuardsAndResolvers: 'always' },
  { path: 'manage/queue', component: QueueComponent, runGuardsAndResolvers: 'always' }
];

export function createGtag(googleAnalyticsCode: string) {
  if (!googleAnalyticsCode) {
    return;
  }

  const lElement = document.createElement(`script`);
  lElement.async = true
  lElement.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsCode}`;

  const gaElementContent= `window.dataLayer = window.dataLayer || [];\n` + `function gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${googleAnalyticsCode}');\n`;
  const gaElement = document.createElement('script');
  gaElement.setAttribute('type', 'text/javascript');
  gaElement.innerHTML = gaElementContent;

  document.getElementsByTagName('head')[0].appendChild(lElement);
  document.getElementsByTagName('head')[0].appendChild(gaElement);
}

/**
 * Initialization logic.
 * 1. Gets the client application's config from the server
 * 2. Initialization authentication and handles an authentication request callback (if there is one)
 * 3. Loads assets for the remembered version of the FHIR server
 * 4. Gets the profile o f the currently logged-in user, if there is one
 */
export function init(
  configService: ConfigService,
  authService: AuthService,
  fhirService: FhirService
) {
  const getConfig = () => {
    return new Promise<void>((resolve, reject) => {
      // Get the initial config for the server and get the FHIR server config
      configService
        .getConfig(true)
        .then(() => {
          createGtag(configService.config.googleAnalyticsCode);

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
        .then(() => resolve()) // Done
        .catch((err) => reject(err)); // Error
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

// noinspection JSDeprecatedSymbols
@NgModule({
  declarations: [
    AppComponent,
    ImplementationGuidesComponent,
    HomeComponent,
    STU3ImplementationGuideComponent,
    R4ImplementationGuideComponent,
    R5ImplementationGuideComponent,
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
    NewProfileComponent,
    ElementDefinitionPanelComponent,
    STU3TypeModalComponent,
    R4TypeModalComponent,
    STU3PageComponentModalComponent,
    R4PageComponentModalComponent,
    R5PageComponentModalComponent,
    CapabilityStatementsComponent,
    CapabilityStatementWrapperComponent,
    STU3CapabilityStatementComponent,
    R4CapabilityStatementComponent,
    R5CapabilityStatementComponent,
    OperationDefinitionsComponent,
    OperationDefinitionComponent,
    ParameterModalComponent,
    ValuesetExpandComponent,
    ConceptCardComponent,
    ImplementationGuideViewComponent,
    OtherResourcesComponent,
    QuestionnairesComponent,
    QuestionnaireComponent,
    QuestionnaireItemModalComponent,
    ImplementationGuideWrapperComponent,
    RouteTransformerDirective,
    MappingModalComponent,
    ImportGithubPanelComponent,
    ExportGithubPanelComponent,
    ContextPanelWrapperComponent,
    ContextPanelR4Component,
    ContextPanelStu3Component,
    PublishComponent,
    IncludePanelComponent,
    BindingPanelComponent,
    R5ResourceModalComponent,
    R4ResourceModalComponent,
    STU3ResourceModalComponent,
    GroupModalComponent,
    OtherResourcesResultComponent,
    PackageListComponent,
    ElementDefinitionConstraintComponent,
    UpdateDiffComponent,
    QueueComponent,
    ExamplesComponent,
    BulkEditComponent,
    PageWrapperComponent,
    R4PageComponent,
    STU3PageComponent,
    IgnoreWarningsComponent,
    JiraSpecComponent,
    CustomMenuComponent,
    SecurityServicesComponent,
    PublishingTemplateComponent,
    MergeUserModalComponent,
    NewProjectComponent,
    SearchParametersComponent,
    SearchParameterComponent,
    PublishingRequestComponent,
    ProjectsComponent,
    ProjectComponent,
    PagesComponent,
    PageComponent,
    AuditComponent,
    WorkGroupComponent,
    TemplateComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      onSameUrlNavigation: 'reload',
    }),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    OAuthModule.forRoot(authModuleConfig),
    NgbModule,
    NgxFileDropModule,
    // TreeModule,
    SharedModule,
    SharedUiModule,
    FhirEditModule,
    ModalsModule,
    InlineDiffComponent
  ],
  providers: [
    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [ConfigService, AuthService, FhirService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true,
    },
    {
      provide: OAuthModuleConfig,
      useValue: authModuleConfig,
    },
    {
      provide: ValidationHandler,
      useClass: JwksValidationHandler,
    },
    {
      provide: OAuthStorage,
      useValue: localStorage,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
