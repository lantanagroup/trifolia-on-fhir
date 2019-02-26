import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {STU3ImplementationGuideComponent} from './implementation-guide.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ImplementationGuideService} from '../../services/implementation-guide.service';
import {AuthService} from '../../services/auth.service';
import {ConfigService} from '../../services/config.service';
import {RecentItemService} from '../../services/recent-item.service';
import {FileService} from '../../services/file.service';
import {Globals} from '../../globals';
import {FhirService} from '../../services/fhir.service';
import {PractitionerService} from '../../services/practitioner.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirStringComponent} from '../../fhir-edit/string/string.component';
import {FhirMarkdownComponent} from '../../fhir-edit/markdown/markdown.component';
import {MarkdownComponent} from '../../markdown/markdown.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirReferenceComponent} from '../../fhir-edit/reference/reference.component';
import {FhirBooleanComponent} from '../../fhir-edit/boolean/boolean.component';
import {FhirSelectSingleCodeComponent} from '../../fhir-edit/select-single-code/select-single-code.component';
import {FhirMultiContactComponent} from '../../fhir-edit/multi-contact/multi-contact.component';
import {ValidationResultsComponent} from '../../validation-results/validation-results.component';
import {RawResourceComponent} from '../../raw-resource/raw-resource.component';
import {FhirXmlPipe} from '../../pipes/fhir-xml-pipe';

describe('STU3ImplementationGuideComponent', () => {
    let component: STU3ImplementationGuideComponent;
    let fixture: ComponentFixture<STU3ImplementationGuideComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                STU3ImplementationGuideComponent,
                FhirStringComponent,
                FhirMarkdownComponent,
                MarkdownComponent,
                TooltipIconComponent,
                FhirReferenceComponent,
                FhirBooleanComponent,
                FhirSelectSingleCodeComponent,
                FhirMultiContactComponent,
                ValidationResultsComponent,
                RawResourceComponent,
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
                ImplementationGuideService,
                AuthService,
                ConfigService,
                RecentItemService,
                FileService,
                Globals,
                FhirService,
                PractitionerService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(STU3ImplementationGuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
