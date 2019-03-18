import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionnaireItemModalComponent} from './questionnaire-item-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {FhirBooleanComponent} from '../fhir-edit/boolean/boolean.component';
import {FhirReferenceComponent} from '../fhir-edit/reference/reference.component';
import {FhirChoiceComponent} from '../fhir-edit/choice/choice.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirIdentifierComponent} from '../fhir-edit/identifier/identifier.component';
import {FhirAttachmentComponent} from '../fhir-edit/attachment/attachment.component';
import {FhirQuantityComponent} from '../fhir-edit/quantity/quantity.component';
import {FhirHumanNameComponent} from '../fhir-edit/human-name/human-name.component';
import {FhirPeriodComponent} from '../fhir-edit/period/period.component';
import {FhirRangeComponent} from '../fhir-edit/range/range.component';
import {FhirRatioComponent} from '../fhir-edit/ratio/ratio.component';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {ConfigService} from '../services/config.service';

describe('QuestionnaireItemModalComponent', () => {
    let component: QuestionnaireItemModalComponent;
    let fixture: ComponentFixture<QuestionnaireItemModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QuestionnaireItemModalComponent,
                FhirStringComponent,
                FhirSelectSingleCodeComponent,
                FhirBooleanComponent,
                FhirReferenceComponent,
                FhirChoiceComponent,
                TooltipIconComponent,
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
                NgbActiveModal,
                FhirService,
                CookieService,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QuestionnaireItemModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
