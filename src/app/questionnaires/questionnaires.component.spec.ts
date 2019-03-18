import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionnairesComponent} from './questionnaires.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../services/config.service';
import {QuestionnaireService} from '../services/questionnaire.service';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';

describe('QuestionnairesComponent', () => {
    let component: QuestionnairesComponent;
    let fixture: ComponentFixture<QuestionnairesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QuestionnairesComponent,
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
                ConfigService,
                QuestionnaireService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QuestionnairesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
