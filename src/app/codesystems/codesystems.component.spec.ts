import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CodesystemsComponent} from './codesystems.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../services/config.service';
import {CodeSystemService} from '../services/code-system.service';
import {Globals} from '../globals';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';

describe('CodesystemsComponent', () => {
    let component: CodesystemsComponent;
    let fixture: ComponentFixture<CodesystemsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CodesystemsComponent,
                TooltipIconComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule,
            ],
            providers: [
                ConfigService,
                CodeSystemService,
                Globals,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CodesystemsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
