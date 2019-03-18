import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirMultiIdentifierComponent} from './multi-identifier.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirSelectSingleCodeComponent} from '../select-single-code/select-single-code.component';
import {FhirStringComponent} from '../string/string.component';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';

describe('FhirMultiIdentifierComponent', () => {
    let component: FhirMultiIdentifierComponent;
    let fixture: ComponentFixture<FhirMultiIdentifierComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirMultiIdentifierComponent,
                TooltipIconComponent,
                FhirSelectSingleCodeComponent,
                FhirStringComponent
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
        fixture = TestBed.createComponent(FhirMultiIdentifierComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
