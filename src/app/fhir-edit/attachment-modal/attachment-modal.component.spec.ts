import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirAttachmentModalComponent} from './attachment-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../globals';
import {FhirSelectSingleCodeComponent} from '../select-single-code/select-single-code.component';
import {FhirStringComponent} from '../string/string.component';
import {FhirDateComponent} from '../date/date.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {ConfigService} from '../../services/config.service';
import {FhirService} from '../../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';

describe('FhirAttachmentModalComponent', () => {
    let component: FhirAttachmentModalComponent;
    let fixture: ComponentFixture<FhirAttachmentModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirAttachmentModalComponent,
                FhirSelectSingleCodeComponent,
                FhirStringComponent,
                FhirDateComponent,
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
                Globals,
                NgbActiveModal,
                ConfigService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirAttachmentModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
