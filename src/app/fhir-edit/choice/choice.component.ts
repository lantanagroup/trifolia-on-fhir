import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirEditAddressModalComponent} from '../address-modal/address-modal.component';
import {FhirEditCodeableConceptModalComponent} from '../codeable-concept-modal/codeable-concept-modal.component';
import {CodeableConcept, Coding} from '../../models/stu3/fhir';
import {FhirEditCodingModalComponent} from '../coding-modal/coding-modal.component';
import {FhirEditContactPointModalComponent} from '../contact-point-modal/contact-point-modal.component';
import {FhirEditHumanNameModalComponent} from '../human-name-modal/human-name-modal.component';

@Component({
    selector: 'app-fhir-choice',
    templateUrl: './choice.component.html',
    styleUrls: ['./choice.component.css']
})
export class ChoiceComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() choices: string[];
    @Input() title: string;
    @Input() required = false;
    @Input() isFormGroup = true;
    @Input() tooltip: string;
    @Input() tooltipKey: string;

    constructor(
        public globals: Globals,
        private modalService: NgbModal) {
    }

    public hasChoice() {
        return !!this.getChoiceName();
    }

    public isString() {
        const foundChoice = this.getChoiceName();

        if (!foundChoice) {
            return false;
        }

        const stringChoices = ['code', 'string', 'uri', 'oid', 'id', 'markdown', 'base64binary', 'dateTime', 'instant', 'time'];
        return stringChoices.indexOf(foundChoice.toLowerCase()) >= 0;
    }

    public isNumber() {
        const foundChoice = this.getChoiceName();

        if (!foundChoice) {
            return false;
        }

        const numberChoices = ['decimal', 'integer', 'unsignedint', 'positiveint'];
        return numberChoices.indexOf(foundChoice.toLowerCase()) >= 0;
    }

    public isQuantity() {
        const foundChoice = this.getChoiceName();

        if (!foundChoice) {
            return false;
        }

        const quantityChoices = ['quantity', 'simplequantity', 'age', 'distance', 'duration', 'count', 'money'];
        return quantityChoices.indexOf(foundChoice.toLowerCase()) >= 0;
    }

    public getChoicePropertyName() {
        const foundChoice = this.getChoiceName();
        if (foundChoice) {
            return this.propertyName + foundChoice.substring(0, 1).toUpperCase() + foundChoice.substring(1);
        }
    }

    public getChoiceName() {
        let foundChoice;

        for (let i = 0; i < this.choices.length; i++) {
            const choice = this.choices[i].substring(0, 1).toUpperCase() + this.choices[i].substring(1);
            if (this.parentObject.hasOwnProperty(this.propertyName + choice)) {
                foundChoice = this.choices[i];
            }
        }

        return foundChoice;
    }

    public setChoicePropertyName(value) {
        let foundChoice = this.getChoiceName();

        if (foundChoice) {
            foundChoice = foundChoice.substring(0, 1).toUpperCase() + foundChoice.substring(1);

            if (foundChoice.toLowerCase() !== value.toLowerCase()) {
                delete this.parentObject[this.propertyName + foundChoice];
            }
        }

        const defaultValue = this.getChoiceDefaultValue(value);
        this.parentObject[this.propertyName + value.substring(0, 1).toUpperCase() + value.substring(1)] = defaultValue;
    }

    public getChoiceDefaultValue(choice: string) {
        switch (choice.toLowerCase()) {
            case 'Address':
                return { text: 'Address' };
            case 'instant':
            case 'date':
            case 'datetime':
            case 'time':
                return '';
            case 'decimal':
            case 'integer':
            case 'unsignedint':
            case 'positiveint':
                return 0;
            case 'code':
            case 'string':
            case 'uri':
            case 'oid':
            case 'id':
            case 'markdown':
            case 'base64binary':
                return '';
            default:
                return {};
        }
    }

    public toggleChoice(shouldHaveChoice?: boolean) {
        const foundChoice = this.getChoiceName();

        if (typeof(shouldHaveChoice) === 'undefined') {
            shouldHaveChoice = !foundChoice;
        }

        if (shouldHaveChoice) {
            if (foundChoice) {
                delete this.parentObject[this.propertyName + foundChoice.substring(0, 1).toUpperCase() + foundChoice.substring(1)];
            }

            if (this.choices.length > 0) {
                const defaultChoice = this.choices[0].substring(0, 1).toUpperCase() + this.choices[0].substring(1);
                const defaultValue = this.getChoiceDefaultValue(defaultChoice);
                this.parentObject[this.propertyName + defaultChoice] = defaultValue;
            }
        } else {
            if (foundChoice) {
                delete this.parentObject[this.propertyName + foundChoice.substring(0, 1).toUpperCase() + foundChoice.substring(1)];
            }
        }
    }

    getAddressDisplay() {
        return this.parentObject[this.getChoicePropertyName()].text || 'Address';
    }

    editAddress() {
        const modalRef = this.modalService.open(FhirEditAddressModalComponent, { size: 'lg' });
        modalRef.componentInstance.address = this.parentObject[this.getChoicePropertyName()];
    }

    getCodeableConceptDisplay() {
        const codeableConcept = <CodeableConcept> this.parentObject[this.getChoicePropertyName()];

        if (codeableConcept.text) {
            return codeableConcept.text;
        } else if (codeableConcept.coding && codeableConcept.coding.length > 0) {
            const values: string[] = [];

            if (codeableConcept.coding[0].display) {
                values.push(codeableConcept.coding[0].display);
            }

            if (codeableConcept.coding[0].code) {
                values.push(codeableConcept.coding[0].code);
            }

            if (codeableConcept.coding[0].system) {
                values.push(codeableConcept.coding[0].system);
            }

            return values.join(' | ');
        }

        return 'Code specified';
    }

    editCodeableConcept() {
        const modalRef = this.modalService.open(FhirEditCodeableConceptModalComponent, { size: 'lg' });
        modalRef.componentInstance.codeableConcept = this.parentObject[this.getChoicePropertyName()];
    }

    getCodingDisplay() {
        const coding = <Coding> this.parentObject[this.getChoicePropertyName()];
        const values: string[] = [];

        if (coding.display) {
            values.push(coding.display);
        }

        if (coding.code) {
            values.push(coding.code);
        }

        if (coding.system) {
            values.push(coding.system);
        }

        if (values.length > 0) {
            return values.join(' | ');
        }

        return 'Coding specified';
    }

    editCoding() {
        const modalRef = this.modalService.open(FhirEditCodingModalComponent);
        modalRef.componentInstance.coding = this.parentObject[this.getChoicePropertyName()];
    }

    editContactPoint() {
        const modalRef = this.modalService.open(FhirEditContactPointModalComponent);
        modalRef.componentInstance.contactPoint = this.parentObject[this.getChoicePropertyName()];
    }

    ngOnInit() {
        if (!this.choices) {
            this.choices = this.globals.dataTypes;
        }

        this.choices.sort();
    }
}
