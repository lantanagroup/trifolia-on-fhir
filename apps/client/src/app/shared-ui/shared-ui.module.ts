import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MarkdownComponent} from './markdown/markdown.component';
import {ResourceHistoryComponent} from './resource-history/resource-history.component';
import {TooltipIconComponent} from './tooltip-icon/tooltip-icon.component';
import {ValidationResultsComponent} from './validation-results/validation-results.component';
import {RawResourceComponent} from './raw-resource/raw-resource.component';
import {SharedModule} from '../shared/shared.module';
import {FhirXmlPipe} from './fhir-xml-pipe';
import {FhirDisplayPipe} from './fhir-display-pipe';
import {KeysPipe} from './keys-pipe';
import {SafePipe} from './safe-pipe';
import {XmlPipe} from './xml-pipe';
import {DiffMatchPatchModule} from 'ng-diff-match-patch';
import {FormsModule} from '@angular/forms';
import {ResourcePermissionsComponent} from './resource-permissions/resource-permissions.component';
import {ImplementationGuideTypeaheadComponent} from './implementation-guide-typeahead/implementation-guide-typeahead.component';
import {SimplemdeModule} from 'ngx-simplemde';
import { IgPublisherSelectionComponent } from './ig-publisher-selection/ig-publisher-selection.component';

const components = [
  MarkdownComponent,
  ResourceHistoryComponent,
  TooltipIconComponent,
  ValidationResultsComponent,
  RawResourceComponent,
  FhirXmlPipe,
  FhirDisplayPipe,
  KeysPipe,
  SafePipe,
  XmlPipe,
  ResourcePermissionsComponent,
  ImplementationGuideTypeaheadComponent,
  IgPublisherSelectionComponent
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    SharedModule,
    DiffMatchPatchModule,
    SimplemdeModule.forRoot({ })
  ]
})
export class SharedUiModule {
}
