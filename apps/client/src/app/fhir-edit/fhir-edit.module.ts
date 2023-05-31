import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {FhirAddressModalComponent} from './address-modal/address-modal.component';
import {FhirAttachmentComponent} from './attachment/attachment.component';
import {FhirAttachmentModalComponent} from './attachment-modal/attachment-modal.component';
import {FhirBooleanComponent} from './boolean/boolean.component';
import {FhirCapabilityStatementResourceModalComponent} from './capability-statement-resource-modal/capability-statement-resource-modal.component';
import {FhirChoiceComponent} from './choice/choice.component';
import {FhirCodeableConceptModalComponent} from './codeable-concept-modal/codeable-concept-modal.component';
import {FhirCodesystemConceptModalComponent} from './codesystem-concept-modal/codesystem-concept-modal.component';
import {FhirCodingModalComponent} from './coding-modal/coding-modal.component';
import {FhirContactModalComponent} from './contact-modal/contact-modal.component';
import {FhirContactPointModalComponent} from './contact-point-modal/contact-point-modal.component';
import {FhirDateComponent} from './date/date.component';
import {FhirHumanNameComponent} from './human-name/human-name.component';
import {FhirHumanNameModalComponent} from './human-name-modal/human-name-modal.component';
import {FhirHumanNamesComponent} from './human-names/human-names.component';
import {FhirIdentifierComponent} from './identifier/identifier.component';
import {FhirIdentifierModalComponent} from './identifier-modal/identifier-modal.component';
import {FhirMarkdownComponent} from './markdown/markdown.component';
import {FhirMaxCardinalityComponent} from './max-cardinality/max-cardinality.component';
import {FhirMessagingEventModalComponent} from './messaging-event-modal/messaging-event-modal.component';
import {FhirMultiContactComponent} from './multi-contact/multi-contact.component';
import {FhirMultiIdentifierComponent} from './multi-identifier/multi-identifier.component';
import {FhirMultiJurisdictionComponent} from './multi-jurisdiction/multi-jurisdiction.component';
import {FhirMultiUseContextComponent} from './multi-use-context/multi-use-context.component';
import {FhirPeriodComponent} from './period/period.component';
import {FhirPractitionerComponent} from './practitioner/practitioner.component';
import {FhirQuantityComponent} from './quantity/quantity.component';
import {FhirRangeComponent} from './range/range.component';
import {FhirRangeModalComponent} from './range-modal/range-modal.component';
import {FhirRatioComponent} from './ratio/ratio.component';
import {FhirRatioModalComponent} from './ratio-modal/ratio-modal.component';
import {FhirReferenceComponent} from './reference/reference.component';
import {FhirReferenceModalComponent} from './reference-modal/reference-modal.component';
import {FhirSelectMultiCodingComponent} from './select-multi-coding/select-multi-coding.component';
import {FhirSelectSingleCodeComponent} from './select-single-code/select-single-code.component';
import {FhirStringComponent} from './string/string.component';
import {FhirValueSetIncludeConceptModalComponent} from './value-set-include-concept-modal/value-set-include-concept-modal.component';
import {FhirEditNumberComponent} from './number/number.component';
import {NarrativeComponent} from './narrative/narrative.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {SharedUiModule} from '../shared-ui/shared-ui.module';
import {FhirEditIdentifierCardComponent} from './identifier-card/identifier-card.component';
import {SimplemdeModule} from 'ngx-simplemde';
import {FhirCanonicalUrlComponent} from './canonical-url/canonical-url.component';

const components = [
  FhirAddressModalComponent,
  FhirAttachmentComponent,
  FhirAttachmentModalComponent,
  FhirBooleanComponent,
  FhirCapabilityStatementResourceModalComponent,
  FhirChoiceComponent,
  FhirCodeableConceptModalComponent,
  FhirCodesystemConceptModalComponent,
  FhirCodingModalComponent,
  FhirContactModalComponent,
  FhirContactPointModalComponent,
  FhirDateComponent,
  FhirHumanNameComponent,
  FhirHumanNameModalComponent,
  FhirHumanNamesComponent,
  FhirIdentifierComponent,
  FhirIdentifierModalComponent,
  FhirMarkdownComponent,
  FhirMaxCardinalityComponent,
  FhirMessagingEventModalComponent,
  FhirMultiContactComponent,
  FhirMultiIdentifierComponent,
  FhirMultiJurisdictionComponent,
  FhirMultiUseContextComponent,
  NarrativeComponent,
  FhirEditNumberComponent,
  FhirPeriodComponent,
  FhirPractitionerComponent,
  FhirQuantityComponent,
  FhirRangeComponent,
  FhirRangeModalComponent,
  FhirRatioComponent,
  FhirRatioModalComponent,
  FhirReferenceComponent,
  FhirReferenceModalComponent,
  FhirSelectMultiCodingComponent,
  FhirSelectSingleCodeComponent,
  FhirStringComponent,
  FhirCanonicalUrlComponent,
  FhirValueSetIncludeConceptModalComponent,
  FhirEditIdentifierCardComponent
];

@NgModule({
    declarations: components,
    exports: components,
    imports: [
        FormsModule,
        CommonModule,
        NgbModule,
        SharedModule,
        SharedUiModule,
        AngularEditorModule,
        SimplemdeModule.forRoot({})
    ]
})
export class FhirEditModule {
}
