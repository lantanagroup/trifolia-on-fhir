import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirBooleanComponent} from './boolean.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../../services/fhir.service';
import {ConfigService} from '../../services/config.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {CookieService} from 'angular2-cookie/core';

describe('FhirBooleanComponent', () => {
    let component: FhirBooleanComponent;
    let fixture: ComponentFixture<FhirBooleanComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
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
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirBooleanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
