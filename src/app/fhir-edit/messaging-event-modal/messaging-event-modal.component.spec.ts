import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirMessagingEventModalComponent} from './messaging-event-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirReferenceComponent} from '../reference/reference.component';
import {FhirSelectSingleCodeComponent} from '../select-single-code/select-single-code.component';
import {FhirStringComponent} from '../string/string.component';
import {FhirService} from '../../services/fhir.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';

describe('FhirMessagingEventModalComponent', () => {
    let component: FhirMessagingEventModalComponent;
    let fixture: ComponentFixture<FhirMessagingEventModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirMessagingEventModalComponent,
                FhirReferenceComponent,
                FhirSelectSingleCodeComponent,
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
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirMessagingEventModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
