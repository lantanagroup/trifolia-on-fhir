import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValuesetConceptCardComponent} from './valueset-concept-card.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../globals';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {ConfigService} from '../services/config.service';

describe('ValuesetConceptCardComponent', () => {
    let component: ValuesetConceptCardComponent;
    let fixture: ComponentFixture<ValuesetConceptCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ValuesetConceptCardComponent,
                TooltipIconComponent,
                FhirStringComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                Globals,
                FhirService,
                CookieService,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ValuesetConceptCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
