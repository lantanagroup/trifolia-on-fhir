import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ExportComponent} from './export.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../services/config.service';
import {CodeSystemService} from '../services/code-system.service';
import {Globals} from '../globals';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {SocketService} from '../services/socket.service';
import {ExportService} from '../services/export.service';
import {GithubService} from '../services/github.service';
import {ExportGithubPanelComponent} from '../export-github-panel/export-github-panel.component';
import {TreeModule} from 'ng2-tree';
import {ImplementationGuideService} from '../services/implementation-guide.service';

describe('ExportComponent', () => {
    let component: ExportComponent;
    let fixture: ComponentFixture<ExportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ExportComponent,
                ExportGithubPanelComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule,
                TreeModule
            ],
            providers: [
                ConfigService,
                CodeSystemService,
                Globals,
                FhirService,
                CookieService,
                SocketService,
                ExportService,
                GithubService,
                ImplementationGuideService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
