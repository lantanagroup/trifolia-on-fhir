import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FhirStringComponent} from './string.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirService} from '../../services/fhir.service';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';

describe('FhirStringComponent', () => {
    let component: FhirStringComponent;
    let fixture: ComponentFixture<FhirStringComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
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
        fixture = TestBed.createComponent(FhirStringComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
