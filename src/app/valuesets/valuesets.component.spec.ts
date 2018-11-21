import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValuesetsComponent} from './valuesets.component';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../services/config.service';
import {Globals} from '../globals';
import {ValueSetService} from '../services/value-set.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {ValidationResultsComponent} from '../validation-results/validation-results.component';
import {RawResourceComponent} from '../raw-resource/raw-resource.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {StringComponent} from '../fhir-edit/string/string.component';
import {SelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {ValuesetConceptCardComponent} from '../valueset-concept-card/valueset-concept-card.component';

describe('ValuesetsComponent', () => {
    let component: ValuesetsComponent;
    let fixture: ComponentFixture<ValuesetsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ValuesetsComponent, TooltipIconComponent, ValidationResultsComponent, RawResourceComponent, FhirXmlPipe, StringComponent, SelectSingleCodeComponent, ValuesetConceptCardComponent],
            imports: [NgbModule.forRoot(), RouterTestingModule, FormsModule],
            providers: [ConfigService, Globals, ValueSetService, NgbModal, HttpClient, HttpHandler, FhirService, CookieService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ValuesetsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
