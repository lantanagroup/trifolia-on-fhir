import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {ConceptDefinitionComponent, ConceptPropertyComponent} from '../../models/stu3/fhir';

@Component({
    selector: 'app-fhir-edit-codesystem-concept-modal',
    templateUrl: './codesystem-concept-modal.component.html',
    styleUrls: ['./codesystem-concept-modal.component.css']
})
export class FhirCodesystemConceptModalComponent implements OnInit {
    @Input() concept: ConceptDefinitionComponent;
    public Globals = Globals;

    constructor(
        public activeModal: NgbActiveModal) {

    }

    getPropertyType(property: ConceptPropertyComponent): string {
        if (property.hasOwnProperty('valueCode')) {
            return 'Code';
        }
        if (property.hasOwnProperty('valueCoding')) {
            return 'Coding';
        }
        if (property.hasOwnProperty('valueString')) {
            return 'String';
        }
        if (property.hasOwnProperty('valueInteger')) {
            return 'Integer';
        }
        if (property.hasOwnProperty('valueBoolean')) {
            return 'Boolean';
        }
        if (property.hasOwnProperty('valueDateTime')) {
            return 'DateTime';
        }

        return '';
    }

    setPropertyType(property: ConceptPropertyComponent, value: string) {
        const existingPropertyType = this.getPropertyType(property);

        if (existingPropertyType !== value) {
            delete property.valueCode;
            delete property.valueCoding;
            delete property.valueString;
            delete property.valueInteger;
            delete property.valueBoolean;
            delete property.valueDateTime;
        }

        switch (value) {
            case 'Code':
            case 'String':
            case 'DateTime':
                property['value' + value] = '';
                break;
            case 'Coding':
                property['valueCoding'] = {};
                break;
            case 'Boolean':
                property['valueBoolean'] = false;
                break;
            case 'Integer':
                property['valueInteger'] = 0;
                break;
        }
    }

    ngOnInit() {
    }

}
