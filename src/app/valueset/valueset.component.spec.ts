import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValuesetComponent} from './valueset.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ValueSetService} from '../shared/value-set.service';
import {ConfigService} from '../shared/config.service';
import {RecentItemService} from '../shared/recent-item.service';
import {FileService} from '../shared/file.service';
import {FhirService} from '../shared/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {TooltipIconComponent} from '../shared/tooltip-icon/tooltip-icon.component';
import {FhirMultiUseContextComponent} from '../fhir-edit/multi-use-context/multi-use-context.component';
import {FhirMarkdownComponent} from '../fhir-edit/markdown/markdown.component';
import {MarkdownComponent} from '../shared/markdown/markdown.component';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {FhirDateComponent} from '../fhir-edit/date/date.component';
import {FhirBooleanComponent} from '../fhir-edit/boolean/boolean.component';
import {ConceptCardComponent} from './concept-card/concept-card.component';
import {ValidationResultsComponent} from '../validation-results/validation-results.component';
import {RawResourceComponent} from '../raw-resource/raw-resource.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {ResourceHistoryComponent} from '../resource-history/resource-history.component';
import {IncludePanelComponent} from './include-panel/include-panel.component';
import {NarrativeComponent} from '../fhir-edit/narrative/narrative.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {DiffMatchPatchModule} from 'ng-diff-match-patch';

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
                FhirXmlPipe,
                ResourceHistoryComponent,
                IncludePanelComponent,
                NarrativeComponent
            ],
            imports: [
                DiffMatchPatchModule,
                AngularEditorModule,
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
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
