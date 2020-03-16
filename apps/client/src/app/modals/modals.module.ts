import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FhirEditModule} from '../fhir-edit/fhir-edit.module';
import {AdminMessageModalComponent} from './admin-message-modal/admin-message-modal.component';
import {ChangeResourceIdModalComponent} from './change-resource-id-modal/change-resource-id-modal.component';
import {FileOpenModalComponent} from './file-open-modal/file-open-modal.component';
import {MarkdownModalComponent} from './markdown-modal/markdown-modal.component';
import {NewUserModalComponent} from './new-user-modal/new-user-modal.component';
import {PublishedIgSelectModalComponent} from './published-ig-select-modal/published-ig-select-modal.component';
import {SelectChoiceModalComponent} from './select-choice-modal/select-choice-modal.component';
import {SettingsModalComponent} from './settings-modal/settings-modal.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SharedUiModule} from '../shared-ui/shared-ui.module';
import {MediaSelectionModalComponent} from './media-selection-modal/media-selection-modal.component';

const modalComponents = [
  AdminMessageModalComponent,
  ChangeResourceIdModalComponent,
  FileOpenModalComponent,
  MarkdownModalComponent,
  NewUserModalComponent,
  PublishedIgSelectModalComponent,
  SelectChoiceModalComponent,
  SettingsModalComponent,
  MediaSelectionModalComponent
];

@NgModule({
  declarations: modalComponents,
  entryComponents: modalComponents,
  exports: modalComponents,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SharedUiModule,
    FhirEditModule,
    NgbModule
  ]
})
export class ModalsModule {
}
