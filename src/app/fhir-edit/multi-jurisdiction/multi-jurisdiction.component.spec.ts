import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirMultiJurisdictionComponent} from './multi-jurisdiction.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';

describe('FhirMultiJurisdictionComponent', () => {
    let component: FhirMultiJurisdictionComponent;
    let fixture: ComponentFixture<FhirMultiJurisdictionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirMultiJurisdictionComponent,
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
        fixture = TestBed.createComponent(FhirMultiJurisdictionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
