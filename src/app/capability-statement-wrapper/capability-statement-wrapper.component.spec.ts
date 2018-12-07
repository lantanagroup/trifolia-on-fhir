import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CapabilityStatementWrapperComponent} from './capability-statement-wrapper.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {FileService} from '../services/file.service';
import {ConfigService} from '../services/config.service';
import {FhirService} from '../services/fhir.service';
import {Globals} from '../globals';
import {CapabilityStatementComponent} from './stu3/capability-statement.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FormsModule} from '@angular/forms';
import {FhirMarkdownComponent} from '../fhir-edit/markdown/markdown.component';
import {FhirDateComponent} from '../fhir-edit/date/date.component';
import {FhirBooleanComponent} from '../fhir-edit/boolean/boolean.component';
import {FhirMultiUseContextComponent} from '../fhir-edit/multi-use-context/multi-use-context.component';
import {FhirMultiJurisdictionComponent} from '../fhir-edit/multi-jurisdiction/multi-jurisdiction.component';
import {FhirReferenceComponent} from '../fhir-edit/reference/reference.component';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {ValidationResultsComponent} from '../validation-results/validation-results.component';
import {RawResourceComponent} from '../raw-resource/raw-resource.component';
import {MarkdownComponent} from '../markdown/markdown.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CapabilityStatementService} from '../services/capability-statement.service';
import {RecentItemService} from '../services/recent-item.service';
import {CookieService} from 'angular2-cookie/core';

describe('CapabilityStatementWrapperComponent', () => {
    let component: CapabilityStatementWrapperComponent;
    let fixture: ComponentFixture<CapabilityStatementWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CapabilityStatementWrapperComponent],
            imports: [TestCapabilityStatementModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CapabilityStatementWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@NgModule({
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
    entryComponents: [CapabilityStatementComponent],
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
})
export class TestCapabilityStatementModule { }