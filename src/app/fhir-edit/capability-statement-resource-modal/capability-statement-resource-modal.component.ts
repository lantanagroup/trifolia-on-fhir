import {Component, Input, OnInit} from '@angular/core';
import {Extension, ResourceComponent, ResourceInteractionComponent} from '../../models/stu3/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import * as _ from 'underscore';

@Component({
    selector: 'app-fhir-capability-statement-resource-modal',
    templateUrl: './capability-statement-resource-modal.component.html',
    styleUrls: ['./capability-statement-resource-modal.component.css']
})
export class FhirEditCapabilityStatementResourceModalComponent implements OnInit {
    @Input() resource: ResourceComponent;

    private readonly expectationUrl = 'http://hl7.org/fhir/StructureDefinition/capabilitystatement-expectation';

    constructor(
        public activeModal: NgbActiveModal,
        public globals: Globals) {

    }

    interactionHasExpectation(interaction: ResourceInteractionComponent) {
        const found = _.find(interaction.extension, (extension) => extension.url === this.expectationUrl);
        return !!found;
    }

    getInteractionExpectation(interaction: ResourceInteractionComponent): string {
        const found = _.find(interaction.extension, (extension) => extension.url === this.expectationUrl);

        if (found) {
            return found.valueCode;
        }
    }

    toggleInteractionExpectation(interaction: ResourceInteractionComponent): Extension {
        interaction.extension = interaction.extension || [];
        let extension = _.find(interaction.extension, (extension) => extension.url === this.expectationUrl);

        if (!extension) {
            extension = {
                url: this.expectationUrl,
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
        let found = _.find(interaction.extension, (extension) => extension.url === this.expectationUrl);

        if (!found) {
            found = this.toggleInteractionExpectation(interaction);
        }

        found.valueCode = valueCode;
    }

    ngOnInit() {
    }
}
