import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewUserModalComponent} from './new-user-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../globals';
import {PractitionerService} from '../services/practitioner.service';
import {FhirPractitionerComponent} from '../fhir-edit/practitioner/practitioner.component';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {FhirHumanNamesComponent} from '../fhir-edit/human-names/human-names.component';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';

describe('NewUserModalComponent', () => {
    let component: NewUserModalComponent;
    let fixture: ComponentFixture<NewUserModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NewUserModalComponent,
                FhirPractitionerComponent,
                FhirSelectSingleCodeComponent,
                FhirHumanNamesComponent,
                FhirStringComponent,
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
                Globals,
                PractitionerService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewUserModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
