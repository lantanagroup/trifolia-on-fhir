import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImplementationGuidesComponent} from './implementation-guides.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../services/config.service';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';

describe('ImplementationGuidesComponent', () => {
    let component: ImplementationGuidesComponent;
    let fixture: ComponentFixture<ImplementationGuidesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ImplementationGuidesComponent,
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
                ConfigService,
                ImplementationGuideService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImplementationGuidesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
