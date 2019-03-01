import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValuesetComponent} from './valueset.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../globals';
import {ValueSetService} from '../services/value-set.service';
import {ConfigService} from '../services/config.service';
import {RecentItemService} from '../services/recent-item.service';
import {FileService} from '../services/file.service';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirMultiUseContextComponent} from '../fhir-edit/multi-use-context/multi-use-context.component';
import {FhirMarkdownComponent} from '../fhir-edit/markdown/markdown.component';
import {MarkdownComponent} from '../markdown/markdown.component';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {FhirDateComponent} from '../fhir-edit/date/date.component';
import {FhirBooleanComponent} from '../fhir-edit/boolean/boolean.component';
import {ConceptCardComponent} from './concept-card/concept-card.component';
import {ValidationResultsComponent} from '../validation-results/validation-results.component';
import {RawResourceComponent} from '../raw-resource/raw-resource.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';

describe('ValuesetComponent', () => {
    let component: ValuesetComponent;
    let fixture: ComponentFixture<ValuesetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ValuesetComponent,
                FhirStringComponent,
                TooltipIconComponent,
                FhirMultiUseContextComponent,
                FhirMarkdownComponent,
                MarkdownComponent,
                FhirSelectSingleCodeComponent,
                FhirDateComponent,
                FhirBooleanComponent,
                ConceptCardComponent,
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
                Globals,
                ValueSetService,
                ConfigService,
                RecentItemService,
                FileService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ValuesetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
