import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirCodingModalComponent} from './coding-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../globals';
import {FhirStringComponent} from '../string/string.component';
import {FhirBooleanComponent} from '../boolean/boolean.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirService} from '../../services/fhir.service';

describe('FhirCodingModalComponent', () => {
    let component: FhirCodingModalComponent;
    let fixture: ComponentFixture<FhirCodingModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirCodingModalComponent,
                FhirStringComponent,
                FhirBooleanComponent,
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
                ConfigService,
                CookieService,
                FhirService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirCodingModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
