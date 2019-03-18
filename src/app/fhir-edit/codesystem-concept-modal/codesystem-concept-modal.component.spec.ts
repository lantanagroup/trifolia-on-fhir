import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirCodesystemConceptModalComponent} from './codesystem-concept-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirStringComponent} from '../string/string.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirBooleanComponent} from '../boolean/boolean.component';
import {FhirDateComponent} from '../date/date.component';
import {ConfigService} from '../../services/config.service';
import {FhirService} from '../../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';

describe('FhirCodesystemConceptModalComponent', () => {
    let component: FhirCodesystemConceptModalComponent;
    let fixture: ComponentFixture<FhirCodesystemConceptModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirCodesystemConceptModalComponent,
                FhirStringComponent,
                TooltipIconComponent,
                FhirBooleanComponent,
                FhirDateComponent
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
                ConfigService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirCodesystemConceptModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
