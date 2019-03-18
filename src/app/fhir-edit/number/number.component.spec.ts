import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FhirEditNumberComponent} from './number.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {ConfigService} from '../../services/config.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';

describe('NumberComponent', () => {
    let component: FhirEditNumberComponent;
    let fixture: ComponentFixture<FhirEditNumberComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirEditNumberComponent,
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
                CookieService,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirEditNumberComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
