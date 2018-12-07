import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirMultiContactComponent} from './multi-contact.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../globals';
import {FhirService} from '../../services/fhir.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirStringComponent} from '../string/string.component';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';

describe('FhirMultiContactComponent', () => {
    let component: FhirMultiContactComponent;
    let fixture: ComponentFixture<FhirMultiContactComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirMultiContactComponent,
                TooltipIconComponent,
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
                Globals,
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirMultiContactComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
