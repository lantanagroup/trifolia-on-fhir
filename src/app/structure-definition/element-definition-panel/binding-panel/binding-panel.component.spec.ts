import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BindingPanelComponent} from './binding-panel.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../../../services/config.service';
import {FhirReferenceComponent} from '../../../fhir-edit/reference/reference.component';
import {TooltipIconComponent} from '../../../tooltip-icon/tooltip-icon.component';
import {FhirSelectSingleCodeComponent} from '../../../fhir-edit/select-single-code/select-single-code.component';
import {FhirStringComponent} from '../../../fhir-edit/string/string.component';
import {FhirService} from '../../../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';

describe('BindingPanelComponent', () => {
    let component: BindingPanelComponent;
    let fixture: ComponentFixture<BindingPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BindingPanelComponent,
                FhirReferenceComponent,
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
                ConfigService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BindingPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
