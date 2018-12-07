import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from './services/auth.service';
import {GithubService} from './services/github.service';
import {ConfigService} from './services/config.service';
import {RecentItemService} from './services/recent-item.service';
import {FhirService} from './services/fhir.service';
import {Globals} from './globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileService} from './services/file.service';
import {HttpClientModule} from '@angular/common/http';
import {PractitionerService} from './services/practitioner.service';
import {CookieService} from 'angular2-cookie/core';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientModule
            ],
            providers: [
                AuthService,
                GithubService,
                ConfigService,
                RecentItemService,
                FhirService,
                Globals,
                NgbModal,
                FileService,
                PractitionerService,
                CookieService
            ]
        }).compileComponents();
    }));
    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
    it(`should have as title 'app'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
    });
    it('should render title in a h1 tag', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
    });
});
