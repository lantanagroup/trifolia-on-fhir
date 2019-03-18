import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TooltipIconComponent} from './tooltip-icon.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {ConfigService} from '../services/config.service';

describe('TooltipIconComponent', () => {
    let component: TooltipIconComponent;
    let fixture: ComponentFixture<TooltipIconComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TooltipIconComponent],
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
        fixture = TestBed.createComponent(TooltipIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
