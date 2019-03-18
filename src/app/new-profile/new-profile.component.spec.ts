import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewProfileComponent} from './new-profile.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {StructureDefinitionService} from '../services/structure-definition.service';
import {FhirService} from '../services/fhir.service';
import {FileService} from '../services/file.service';
import {ConfigService} from '../services/config.service';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {FhirBooleanComponent} from '../fhir-edit/boolean/boolean.component';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {RawResourceComponent} from '../raw-resource/raw-resource.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {CookieService} from 'angular2-cookie/core';

describe('NewProfileComponent', () => {
    let component: NewProfileComponent;
    let fixture: ComponentFixture<NewProfileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NewProfileComponent,
                FhirStringComponent,
                FhirBooleanComponent,
                FhirSelectSingleCodeComponent,
                RawResourceComponent,
                TooltipIconComponent,
                FhirXmlPipe
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                StructureDefinitionService,
                FhirService,
                ConfigService,
                FileService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
