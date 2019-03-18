import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirMultiUseContextComponent} from './multi-use-context.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {CookieService} from 'angular2-cookie/core';
import {ConfigService} from '../../services/config.service';

describe('MultiUseContextComponent', () => {
    let component: FhirMultiUseContextComponent;
    let fixture: ComponentFixture<FhirMultiUseContextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirMultiUseContextComponent,
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
        fixture = TestBed.createComponent(FhirMultiUseContextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
