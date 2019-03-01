import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {R4TypeModalComponent} from './type-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../../globals';
import {FhirService} from '../../../services/fhir.service';
import {ConfigService} from '../../../services/config.service';
import {TooltipIconComponent} from '../../../tooltip-icon/tooltip-icon.component';
import {CookieService} from 'angular2-cookie/core';
import {FhirSelectSingleCodeComponent} from '../../../fhir-edit/select-single-code/select-single-code.component';

describe('R4TypeModalComponent', () => {
    let component: R4TypeModalComponent;
    let fixture: ComponentFixture<R4TypeModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                R4TypeModalComponent,
                TooltipIconComponent,
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
                NgbActiveModal,
                Globals,
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(R4TypeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
