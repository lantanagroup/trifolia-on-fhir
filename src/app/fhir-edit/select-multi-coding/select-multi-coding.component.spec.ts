import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirSelectMultiCodingComponent} from './select-multi-coding.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../globals';
import {FhirService} from '../../services/fhir.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';

describe('FhirSelectMultiCodingComponent', () => {
    let component: FhirSelectMultiCodingComponent;
    let fixture: ComponentFixture<FhirSelectMultiCodingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirSelectMultiCodingComponent,
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
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirSelectMultiCodingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
