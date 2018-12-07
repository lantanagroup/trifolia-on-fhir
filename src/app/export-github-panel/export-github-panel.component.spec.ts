import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportGithubPanelComponent} from './export-github-panel.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {GithubService} from '../services/github.service';
import {ImportService} from '../services/import.service';
import {FhirService} from '../services/fhir.service';
import {ConfigService} from '../services/config.service';
import {Globals} from '../globals';
import {TreeModule} from 'ng2-tree';

describe('ExportGithubPanelComponent', () => {
    let component: ExportGithubPanelComponent;
    let fixture: ComponentFixture<ExportGithubPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
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
                GithubService,
                ImportService,
                FhirService,
                ConfigService,
                Globals
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportGithubPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
