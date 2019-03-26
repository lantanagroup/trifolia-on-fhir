import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContextPanelStu3Component} from './context-panel-stu3.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../../shared/fhir.service';
import {ConfigService} from '../../../shared/config.service';
import {CookieService} from 'angular2-cookie/core';
import {TooltipIconComponent} from '../../../tooltip-icon/tooltip-icon.component';

describe('ContextPanelStu3Component', () => {
    let component: ContextPanelStu3Component;
    let fixture: ComponentFixture<ContextPanelStu3Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ContextPanelStu3Component,
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
        fixture = TestBed.createComponent(ContextPanelStu3Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
