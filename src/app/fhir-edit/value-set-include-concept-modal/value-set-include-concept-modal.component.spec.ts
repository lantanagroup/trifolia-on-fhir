import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FhirValueSetIncludeConceptModalComponent} from './value-set-include-concept-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../globals';
import {FhirService} from '../../services/fhir.service';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirStringComponent} from '../string/string.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';

describe('FhirValueSetIncludeConceptModalComponent', () => {
    let component: FhirValueSetIncludeConceptModalComponent;
    let fixture: ComponentFixture<FhirValueSetIncludeConceptModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirValueSetIncludeConceptModalComponent,
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
                Globals,
                NgbActiveModal,
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirValueSetIncludeConceptModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
