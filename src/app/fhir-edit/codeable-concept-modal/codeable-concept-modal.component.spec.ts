import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirCodeableConceptModalComponent} from './codeable-concept-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../globals';
import {FhirStringComponent} from '../string/string.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {CookieService} from 'angular2-cookie/core';
import {FhirService} from '../../services/fhir.service';
import {ConfigService} from '../../services/config.service';

describe('FhirCodeableConceptModalComponent', () => {
    let component: FhirCodeableConceptModalComponent;
    let fixture: ComponentFixture<FhirCodeableConceptModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirCodeableConceptModalComponent,
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
                NgbActiveModal,
                Globals,
                CookieService,
                FhirService,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirCodeableConceptModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
