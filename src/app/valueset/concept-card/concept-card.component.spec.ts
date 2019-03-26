import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConceptCardComponent} from './concept-card.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../shared/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirStringComponent} from '../../fhir-edit/string/string.component';
import {ConfigService} from '../../shared/config.service';

describe('ValuesetConceptCardComponent', () => {
    let component: ConceptCardComponent;
    let fixture: ComponentFixture<ConceptCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConceptCardComponent,
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
                FhirService,
                CookieService,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConceptCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
