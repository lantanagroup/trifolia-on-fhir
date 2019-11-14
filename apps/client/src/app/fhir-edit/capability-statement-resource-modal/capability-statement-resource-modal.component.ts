import {Component, Input} from '@angular/core';
import {
  Extension,
  ResourceComponent,
  ResourceInteractionComponent
} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {
  CapabilityStatementResourceComponent,
  StructureDefinition
} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {ConfigService} from '../../shared/config.service';
import {FhirReferenceModalComponent, ResourceSelection} from '../reference-modal/reference-modal.component';

@Component({
  templateUrl: './capability-statement-resource-modal.component.html',
  styleUrls: ['./capability-statement-resource-modal.component.css']
})
export class FhirCapabilityStatementResourceModalComponent {
  @Input() resource: ResourceComponent | CapabilityStatementResourceComponent;
  public Globals = Globals;

  constructor(
    public modal: NgbModal,
    public activeModal: NgbActiveModal,
    public configService: ConfigService) {

  }

  get r4Resource(): CapabilityStatementResourceComponent {
    return <CapabilityStatementResourceComponent> this.resource;
  }

  get stu3Resource(): ResourceComponent {
    return <ResourceComponent> this.resource;
  }

  selectSupportedProfile(index: number) {
    const modalRef = this.modal.open(FhirReferenceModalComponent, { size: 'lg' });
    modalRef.componentInstance.resourceType = 'StructureDefinition';
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((selection: ResourceSelection) => {
      const profile = <StructureDefinition> selection.resource;
      this.r4Resource.supportedProfile[index] = profile.url;
    });
  }

  interactionHasExpectation(interaction: ResourceInteractionComponent) {
    const found = (interaction.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-cs-expectation']);
    return !!found;
  }

  getInteractionExpectation(interaction: ResourceInteractionComponent): string {
    const found = (interaction.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-cs-expectation']);

    if (found) {
      return found.valueCode;
    }
  }

  toggleInteractionExpectation(interaction: ResourceInteractionComponent): Extension {
    interaction.extension = interaction.extension || [];
    let extension = (interaction.extension || []).find((ext) => ext.url === Globals.extensionUrls['extension-cs-expectation']);

    if (!extension) {
      extension = {
        url: Globals.extensionUrls['extension-cs-expectation'],
        valueCode: 'SHALL'
      };
      interaction.extension.push(extension);
    } else {
      const index = interaction.extension.indexOf(extension);
      interaction.extension.splice(index, 1);
    }

    return extension;
  }

  setInteractionExpectation(interaction: ResourceInteractionComponent, valueCode: string) {
    interaction.extension = interaction.extension || [];
    let found = (interaction.extension || []).find((ext) => ext.url === Globals.extensionUrls['extension-cs-expectation']);

    if (!found) {
      found = this.toggleInteractionExpectation(interaction);
    }

    found.valueCode = valueCode;
  }
}
