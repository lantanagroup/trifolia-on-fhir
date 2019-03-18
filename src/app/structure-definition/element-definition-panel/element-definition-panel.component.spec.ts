import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ElementDefinitionPanelComponent} from './element-definition-panel.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {ConfigService} from '../../services/config.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirStringComponent} from '../../fhir-edit/string/string.component';
import {FhirSelectSingleCodeComponent} from '../../fhir-edit/select-single-code/select-single-code.component';
import {FhirBooleanComponent} from '../../fhir-edit/boolean/boolean.component';
import {FhirMarkdownComponent} from '../../fhir-edit/markdown/markdown.component';
import {MarkdownComponent} from '../../markdown/markdown.component';
import {FhirReferenceComponent} from '../../fhir-edit/reference/reference.component';
import {FhirChoiceComponent} from '../../fhir-edit/choice/choice.component';
import {FhirIdentifierComponent} from '../../fhir-edit/identifier/identifier.component';
import {FhirAttachmentComponent} from '../../fhir-edit/attachment/attachment.component';
import {FhirQuantityComponent} from '../../fhir-edit/quantity/quantity.component';
import {FhirHumanNameComponent} from '../../fhir-edit/human-name/human-name.component';
import {FhirPeriodComponent} from '../../fhir-edit/period/period.component';
import {FhirRangeComponent} from '../../fhir-edit/range/range.component';
import {FhirRatioComponent} from '../../fhir-edit/ratio/ratio.component';
import {CookieService} from 'angular2-cookie/core';

describe('ElementDefinitionPanelComponent', () => {
    let component: ElementDefinitionPanelComponent;
    let fixture: ComponentFixture<ElementDefinitionPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ElementDefinitionPanelComponent,
                TooltipIconComponent,
                FhirStringComponent,
                FhirSelectSingleCodeComponent,
                FhirBooleanComponent,
                FhirMarkdownComponent,
                MarkdownComponent,
                FhirReferenceComponent,
                FhirChoiceComponent,
                FhirIdentifierComponent,
                FhirAttachmentComponent,
                FhirQuantityComponent,
                FhirHumanNameComponent,
                FhirPeriodComponent,
                FhirRangeComponent,
                FhirRatioComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ElementDefinitionPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
