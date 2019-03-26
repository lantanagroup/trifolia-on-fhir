import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContextPanelR4Component} from './context-panel-r4.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../../shared/fhir.service';
import {ConfigService} from '../../../shared/config.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirStringComponent} from '../../../fhir-edit/string/string.component';
import {TooltipIconComponent} from '../../../tooltip-icon/tooltip-icon.component';

describe('ContextPanelR4Component', () => {
    let component: ContextPanelR4Component;
    let fixture: ComponentFixture<ContextPanelR4Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ContextPanelR4Component,
                FhirStringComponent,
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
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContextPanelR4Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
