import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImplementationGuidesComponent } from './implementation-guides/implementation-guides.component';
import { HomeComponent } from './home/home.component';
import { ImplementationGuideComponent } from './implementation-guide/implementation-guide.component';
import { RouterModule, Routes } from '@angular/router';
import { ExportComponent } from './export/export.component';
import { ImportComponent } from './import/import.component';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'implementation-guides', component: ImplementationGuidesComponent },
  { path: 'implementation-guide/:id', component: ImplementationGuideComponent },
  { path: 'export', component: ExportComponent },
  { path: 'import', component: ImportComponent },
  { path: 'profile', component: ProfileComponent },
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
    ProfileComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
