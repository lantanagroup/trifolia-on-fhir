import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImportComponent} from './import.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../shared/fhir.service';
import {ImportService} from '../shared/import.service';
import {CookieService} from 'angular2-cookie/core';
import {GithubService} from '../shared/github.service';
import {ConfigService} from '../shared/config.service';
import {ImportGithubPanelComponent} from './import-github-panel/import-github-panel.component';
import {FileDropModule} from 'ngx-file-drop';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {TreeModule} from 'ng2-tree';

describe('ImportComponent', () => {
    let component: ImportComponent;
    let fixture: ComponentFixture<ImportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ImportComponent,
                ImportGithubPanelComponent,
                FhirXmlPipe
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule,
                FileDropModule,
                TreeModule
            ],
            providers: [
                FhirService,
                ImportService,
                CookieService,
                GithubService,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
