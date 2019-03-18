import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {STU3TypeModalComponent} from './type-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../../services/fhir.service';
import {ConfigService} from '../../../services/config.service';
import {TooltipIconComponent} from '../../../tooltip-icon/tooltip-icon.component';
import {CookieService} from 'angular2-cookie/core';

describe('STU3TypeModalComponent', () => {
    let component: STU3TypeModalComponent;
    let fixture: ComponentFixture<STU3TypeModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                STU3TypeModalComponent,
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
        fixture = TestBed.createComponent(STU3TypeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
