import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IncludePanelComponent} from './include-panel.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {ConfigService} from '../../services/config.service';
import {FhirStringComponent} from '../../fhir-edit/string/string.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {ConceptCardComponent} from '../concept-card/concept-card.component';
import {FhirSelectSingleCodeComponent} from '../../fhir-edit/select-single-code/select-single-code.component';

describe('IncludePanelComponent', () => {
    let component: IncludePanelComponent;
    let fixture: ComponentFixture<IncludePanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TooltipIconComponent,
                ConceptCardComponent,
                IncludePanelComponent,
                FhirStringComponent,
                FhirSelectSingleCodeComponent
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
        fixture = TestBed.createComponent(IncludePanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
