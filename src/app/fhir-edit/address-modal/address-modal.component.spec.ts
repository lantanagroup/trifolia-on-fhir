import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirAddressModalComponent} from './address-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirStringComponent} from '../string/string.component';
import {FhirSelectSingleCodeComponent} from '../select-single-code/select-single-code.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirService} from '../../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {ConfigService} from '../../services/config.service';

describe('FhirAddressModalComponent', () => {
    let component: FhirAddressModalComponent;
    let fixture: ComponentFixture<FhirAddressModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirAddressModalComponent,
                FhirStringComponent,
                FhirSelectSingleCodeComponent,
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
                CookieService,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirAddressModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
