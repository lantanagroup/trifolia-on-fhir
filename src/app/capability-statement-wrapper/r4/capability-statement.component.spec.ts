import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CapabilityStatementComponent} from './capability-statement.component';
import {FhirStringComponent} from '../../fhir-edit/string/string.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirMarkdownComponent} from '../../fhir-edit/markdown/markdown.component';
import {MarkdownComponent} from '../../markdown/markdown.component';
import {FhirDateComponent} from '../../fhir-edit/date/date.component';
import {FhirBooleanComponent} from '../../fhir-edit/boolean/boolean.component';
import {FhirMultiUseContextComponent} from '../../fhir-edit/multi-use-context/multi-use-context.component';
import {FhirMultiJurisdictionComponent} from '../../fhir-edit/multi-jurisdiction/multi-jurisdiction.component';
import {FhirReferenceComponent} from '../../fhir-edit/reference/reference.component';
import {FhirSelectSingleCodeComponent} from '../../fhir-edit/select-single-code/select-single-code.component';
import {ValidationResultsComponent} from '../../validation-results/validation-results.component';
import {RawResourceComponent} from '../../raw-resource/raw-resource.component';
import {FhirXmlPipe} from '../../pipes/fhir-xml-pipe';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FileService} from '../../services/file.service';
import {ConfigService} from '../../services/config.service';
import {FhirService} from '../../services/fhir.service';
import {Globals} from '../../globals';
import {CapabilityStatementService} from '../../services/capability-statement.service';
import {RecentItemService} from '../../services/recent-item.service';
import {CookieService} from 'angular2-cookie/core';

describe('R4CapabilityStatementComponent', () => {
    let component: CapabilityStatementComponent;
    let fixture: ComponentFixture<CapabilityStatementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CapabilityStatementComponent,
                FhirStringComponent,
                TooltipIconComponent,
                FhirMarkdownComponent,
                MarkdownComponent,
                FhirDateComponent,
                FhirBooleanComponent,
                FhirMultiUseContextComponent,
                FhirMultiJurisdictionComponent,
                FhirReferenceComponent,
                FhirSelectSingleCodeComponent,
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
                FileService,
                ConfigService,
                FhirService,
                Globals,
                CapabilityStatementService,
                RecentItemService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CapabilityStatementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
