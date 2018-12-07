import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImplementationGuideWrapperComponent} from './implementation-guide-wrapper.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ImplementationGuideComponent} from './stu3/implementation-guide.component';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {FhirMarkdownComponent} from '../fhir-edit/markdown/markdown.component';
import {MarkdownComponent} from '../markdown/markdown.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirReferenceComponent} from '../fhir-edit/reference/reference.component';
import {FhirBooleanComponent} from '../fhir-edit/boolean/boolean.component';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {FhirMultiContactComponent} from '../fhir-edit/multi-contact/multi-contact.component';
import {ValidationResultsComponent} from '../validation-results/validation-results.component';
import {RawResourceComponent} from '../raw-resource/raw-resource.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {AuthService} from '../services/auth.service';
import {ConfigService} from '../services/config.service';
import {RecentItemService} from '../services/recent-item.service';
import {FileService} from '../services/file.service';
import {Globals} from '../globals';
import {FhirService} from '../services/fhir.service';
import {PractitionerService} from '../services/practitioner.service';
import {CookieService} from 'angular2-cookie/core';
import {NgModule} from '@angular/core';

describe('ImplementationGuideWrapperComponent', () => {
    let component: ImplementationGuideWrapperComponent;
    let fixture: ComponentFixture<ImplementationGuideWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ImplementationGuideWrapperComponent],
            imports: [TestImplementationGuideWrapperModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImplementationGuideWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@NgModule({
    declarations: [
        ImplementationGuideComponent,
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
    entryComponents: [ImplementationGuideComponent],
    imports: [
        BrowserModule,
        RouterTestingModule,
        HttpClientModule,
        NgbModule.forRoot(),
        FormsModule
    ],
    providers: [
        NgbActiveModal,
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
})
export class TestImplementationGuideWrapperModule { }