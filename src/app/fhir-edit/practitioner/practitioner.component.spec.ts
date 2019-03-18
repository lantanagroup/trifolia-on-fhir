import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FhirPractitionerComponent} from './practitioner.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../../services/config.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirStringComponent} from '../string/string.component';
import {FhirSelectSingleCodeComponent} from '../select-single-code/select-single-code.component';
import {FhirHumanNamesComponent} from '../human-names/human-names.component';
import {FhirService} from '../../services/fhir.service';

describe('FhirPractitionerComponent', () => {
    let component: FhirPractitionerComponent;
    let fixture: ComponentFixture<FhirPractitionerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirPractitionerComponent,
                TooltipIconComponent,
                FhirStringComponent,
                FhirSelectSingleCodeComponent,
                FhirHumanNamesComponent
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
                FhirService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirPractitionerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
