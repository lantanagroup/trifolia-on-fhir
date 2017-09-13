import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImplementationGuidesComponent } from './implementation-guides/implementation-guides.component';
import { HomeComponent } from './home/home.component';
import { ImplementationGuideComponent } from './implementation-guide/implementation-guide.component';
import { RouterModule, Routes } from '@angular/router';
import { ExportComponent } from './export/export.component';
import { ImportComponent } from './import/import.component';
import { ProfileComponent } from './profile/profile.component';
import { ValuesetsComponent } from './valuesets/valuesets.component';
import { ValuesetComponent } from './valueset/valueset.component';
import { CodesystemsComponent } from './codesystems/codesystems.component';
import { CodesystemComponent } from './codesystem/codesystem.component';
import { LoginComponent } from './login/login.component';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { UserService } from './user.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig(), http, options);
}

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'implementation-guides', component: ImplementationGuidesComponent },
  { path: 'implementation-guide/:id', component: ImplementationGuideComponent },
  { path: 'valuesets', component: ValuesetsComponent },
  { path: 'valuesets/:id', component: ValuesetComponent },
  { path: 'codesystems', component: CodesystemsComponent },
  { path: 'codesystems/:id', component: CodesystemComponent },
  { path: 'export', component: ExportComponent },
  { path: 'import', component: ImportComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ImplementationGuidesComponent,
    HomeComponent,
    ImplementationGuideComponent,
    ExportComponent,
    ImportComponent,
    ProfileComponent,
    ValuesetsComponent,
    ValuesetComponent,
    CodesystemsComponent,
    CodesystemComponent,
    LoginComponent
  ],
  imports: [
      RouterModule.forRoot(
          appRoutes,
          { enableTracing: true } // <-- debugging purposes only
      ),
      BrowserModule,
      FormsModule,
      HttpModule,
      NgbModule.forRoot()
  ],
  providers: [
    {
        provide: AuthHttp,
        useFactory: authHttpServiceFactory,
        deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
