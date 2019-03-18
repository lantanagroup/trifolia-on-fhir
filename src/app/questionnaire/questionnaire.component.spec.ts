import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionnaireComponent} from './questionnaire.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {QuestionnaireService} from '../services/questionnaire.service';
import {ConfigService} from '../services/config.service';
import {RecentItemService} from '../services/recent-item.service';
import {FileService} from '../services/file.service';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {FhirMarkdownComponent} from '../fhir-edit/markdown/markdown.component';
import {MarkdownComponent} from '../markdown/markdown.component';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {FhirDateComponent} from '../fhir-edit/date/date.component';
import {FhirMultiUseContextComponent} from '../fhir-edit/multi-use-context/multi-use-context.component';
import {FhirMultiJurisdictionComponent} from '../fhir-edit/multi-jurisdiction/multi-jurisdiction.component';
import {FhirMultiContactComponent} from '../fhir-edit/multi-contact/multi-contact.component';
import {ValidationResultsComponent} from '../validation-results/validation-results.component';
import {RawResourceComponent} from '../raw-resource/raw-resource.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirBooleanComponent} from '../fhir-edit/boolean/boolean.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {ResourceHistoryComponent} from '../resource-history/resource-history.component';
import {DiffMatchPatchModule} from 'ng-diff-match-patch';

describe('QuestionnaireComponent', () => {
    let component: QuestionnaireComponent;
    let fixture: ComponentFixture<QuestionnaireComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QuestionnaireComponent,
                FhirStringComponent,
                FhirMarkdownComponent,
                MarkdownComponent,
                FhirSelectSingleCodeComponent,
                FhirDateComponent,
                FhirMultiUseContextComponent,
                FhirMultiJurisdictionComponent,
                FhirMultiContactComponent,
                ValidationResultsComponent,
                RawResourceComponent,
                TooltipIconComponent,
                FhirBooleanComponent,
                FhirXmlPipe,
                ResourceHistoryComponent
            ],
            imports: [
                DiffMatchPatchModule,
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                QuestionnaireService,
                ConfigService,
                RecentItemService,
                FileService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QuestionnaireComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
