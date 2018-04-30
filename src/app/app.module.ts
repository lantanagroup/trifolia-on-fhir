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
import {ConfigService} from './services/config.service';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {StringComponent} from './fhir-edit/string/string.component';
import {SelectChoiceModalComponent} from './select-choice-modal/select-choice-modal.component';
import {ElementDefinitionPanelComponent} from './element-definition-panel/element-definition-panel.component';
import {ElementDefinitionTypeModalComponent} from './fhir-edit/element-definition-type-modal/element-definition-type-modal.component';
import {Globals} from './globals';
import {MarkdownComponent} from './markdown/markdown.component';
import {TJsonViewerModule} from 't-json-viewer';

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
    {path: 'implementation-guide/:id', component: ImplementationGuideComponent},
    {path: 'structure-definition', component: StructureDefinitionsComponent},
    {path: 'structure-definition/new', component: NewProfileComponent},
    {path: 'structure-definition/:id', component: StructureDefinitionComponent},
    {path: 'valuesets', component: ValuesetsComponent},
    {path: 'valuesets/:id', component: ValuesetComponent},
    {path: 'codesystems', component: CodesystemsComponent},
    {path: 'codesystems/:id', component: CodesystemComponent},
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
        ElementDefinitionTypeModalComponent
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
        MarkdownComponent
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
        Globals
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}