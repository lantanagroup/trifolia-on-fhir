import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CapabilityStatementsComponent} from './capability-statements.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {CapabilityStatementService} from '../services/capability-statement.service';
import {ConfigService} from '../services/config.service';
import {Globals} from '../globals';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';

describe('CapabilityStatementsComponent', () => {
    let component: CapabilityStatementsComponent;
    let fixture: ComponentFixture<CapabilityStatementsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CapabilityStatementsComponent,
                TooltipIconComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                CapabilityStatementService,
                ConfigService,
                Globals,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CapabilityStatementsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
