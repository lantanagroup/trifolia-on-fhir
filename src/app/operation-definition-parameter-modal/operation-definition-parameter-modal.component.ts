import {Component, Input, OnInit} from '@angular/core';
import {OperationDefinition, ParameterComponent} from '../models/stu3/fhir';
import {Globals} from '../globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-operation-definition-parameter-modal',
    templateUrl: './operation-definition-parameter-modal.component.html',
    styleUrls: ['./operation-definition-parameter-modal.component.css']
})
export class OperationDefinitionParameterModalComponent implements OnInit {
    @Input() operationDefinition: OperationDefinition;
    @Input() parameter: ParameterComponent;

    constructor(
        public activeModal: NgbActiveModal,
        private globals: Globals) {

    }

    public get valueSetChoice(): string {
        if (!this.parameter.binding) {
            return '';
        }

        if (this.parameter.binding.hasOwnProperty('valueSetUri')) {
            return 'Uri';
        } else if (this.parameter.binding.hasOwnProperty('valueSetReference')) {
            return 'Reference';
        }
    }

    public set valueSetChoice(value: string) {
        if (!this.parameter.binding) {
            return;
        }

        if (value === 'Uri' && !this.parameter.binding.hasOwnProperty('valueSetUri')) {
            delete this.parameter.binding.valueSetReference;
            this.parameter.binding.valueSetUri = '';
        } else if (value === 'Reference' && !this.parameter.binding.hasOwnProperty('valueSetReference')) {
            delete this.parameter.binding.valueSetUri;
            this.parameter.binding.valueSetReference = { reference: '', display: '' };
        }
    }

    ngOnInit() {
    }

}
