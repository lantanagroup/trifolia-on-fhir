import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationDefinitionsComponent} from './operation-definitions.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../services/config.service';
import {OperationDefinitionService} from '../services/operation-definition.service';
import {Globals} from '../globals';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';

describe('OperationDefinitionsComponent', () => {
    let component: OperationDefinitionsComponent;
    let fixture: ComponentFixture<OperationDefinitionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OperationDefinitionsComponent,
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
                OperationDefinitionService,
                Globals,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OperationDefinitionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
