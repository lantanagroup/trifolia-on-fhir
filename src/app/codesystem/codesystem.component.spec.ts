import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CodesystemComponent} from './codesystem.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {CodeSystemService} from '../services/code-system.service';
import {ConfigService} from '../services/config.service';
import {RecentItemService} from '../services/recent-item.service';
import {FileService} from '../services/file.service';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {ValidationResultsComponent} from '../validation-results/validation-results.component';
import {RawResourceComponent} from '../raw-resource/raw-resource.component';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {FhirBooleanComponent} from '../fhir-edit/boolean/boolean.component';
import {FhirDateComponent} from '../fhir-edit/date/date.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirMarkdownComponent} from '../fhir-edit/markdown/markdown.component';
import {MarkdownComponent} from '../markdown/markdown.component';
import {FhirMultiUseContextComponent} from '../fhir-edit/multi-use-context/multi-use-context.component';
import {FhirMultiJurisdictionComponent} from '../fhir-edit/multi-jurisdiction/multi-jurisdiction.component';
import {FhirMultiContactComponent} from '../fhir-edit/multi-contact/multi-contact.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {ResourceHistoryComponent} from '../resource-history/resource-history.component';
import {DiffMatchPatchModule} from 'ng-diff-match-patch';

describe('CodesystemComponent', () => {
    let component: CodesystemComponent;
    let fixture: ComponentFixture<CodesystemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CodesystemComponent,
                FhirStringComponent,
                ValidationResultsComponent,
                RawResourceComponent,
                FhirXmlPipe,
                FhirSelectSingleCodeComponent,
                FhirBooleanComponent,
                FhirDateComponent,
                TooltipIconComponent,
                FhirMarkdownComponent,
                MarkdownComponent,
                FhirMultiUseContextComponent,
                FhirMultiJurisdictionComponent,
                FhirMultiContactComponent,
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
                CodeSystemService,
                ConfigService,
                RecentItemService,
                FileService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CodesystemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
