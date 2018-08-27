import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ElementDefinitionTypeModalComponent} from '../fhir-edit/element-definition-type-modal/element-definition-type-modal.component';
import {Globals} from '../globals';
import {ElementTreeModel} from '../models/element-tree-model';
import {
    Coding,
    ElementDefinition,
    ElementDefinitionBindingComponent,
    StructureDefinition,
    TypeRefComponent
} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {FhirService} from '../services/fhir.service';

@Component({
    selector: 'app-element-definition-panel',
    templateUrl: './element-definition-panel.component.html',
    styleUrls: ['./element-definition-panel.component.css']
})
export class ElementDefinitionPanelComponent implements OnInit {
    @Input() elementTreeModel: ElementTreeModel;
    @Input() elementTreeModels: ElementTreeModel[];
    @Input() structureDefinition: StructureDefinition;
    @Input() disabled = false;

    public editingSliceName: boolean;
    public editedSliceName: string;
    public valueSetChoices = ['Uri', 'Reference'];
    public types: Coding[] = [];
    public definedTypeCodes: Coding[] = [];

    constructor(
        private modalService: NgbModal,
        private fhirService: FhirService,
        public globals: Globals) {

    }

    get element(): ElementDefinition {
        return this.elementTreeModel.constrainedElement;
    }

    toggleMaxUnlimited() {
        if (!this.element.hasOwnProperty('max')) {
            return;
        }

        if (this.element.max === '*') {
            this.element.max = '1';
        } else {
            this.element.max = '*';
        }
    }

    openTypeModel(element, type) {
        const modalRef = this.modalService.open(ElementDefinitionTypeModalComponent);
        modalRef.componentInstance.element = element;
        modalRef.componentInstance.type = type;
    }

    toggleEditSliceName(commit?: boolean) {
        if (this.editingSliceName) {
            let newId = this.element.id.substring(0, this.element.id.lastIndexOf(':'));
            newId = newId + ':' + this.editedSliceName;

            _.chain(this.structureDefinition.differential.element)
                .filter((nextElement) => {
                    return nextElement.id.startsWith(this.element.id + '.');
                })
                .each((childElement) => {
                    if (childElement.sliceName === this.element.sliceName) {
                        childElement.sliceName = this.editedSliceName;
                    }

                    const newChildElementId = newId + childElement.id.substring(this.element.id.length);
                    childElement.id = newChildElementId;
                });

            this.element.sliceName = this.editedSliceName;
            this.element.id = newId;
            this.editingSliceName = false;
        } else {
            this.editingSliceName = true;
            this.editedSliceName = this.element.sliceName;
        }
    }

    setValueSetChoice(elementBinding: any, choice: string) {
        const foundChoice = this.globals.getChoiceProperty(elementBinding, 'valueSet', ['Uri', 'Reference']);

        if (foundChoice !== choice) {
            delete elementBinding['valueSet' + foundChoice];
        }

        switch (choice) {
            case 'Uri':
                elementBinding['valueSetUri'] = '';
                break;
            case 'Reference':
                elementBinding['valueSetReference'] = {
                    reference: '',
                    display: ''
                };
                break;
        }
    }

    private getTypes(): Coding[] {
        const elementTreeModelTypes = this.element.type ? this.element.type : [];

        return _.filter(this.definedTypeCodes, (definedTypeCode: Coding) => {
            const foundType = _.find(elementTreeModelTypes, (type: TypeRefComponent) => type.code === definedTypeCode.code);
            return !foundType;        // Only return definedTypeCodes that are no found in the list of types in the element
        });
    }

    private getDefaultType(): string {
        const types = this.getTypes();

        if (types.length > 0) {
            return types[0].code;
        }

        return '';
    }

    addType() {
        this.element.type.push({code: this.getDefaultType()});
        this.typeChanged();
    }

    typeChanged() {
        this.types = this.getTypes();
    }

    getTypeDisplay(code: string) {
        const foundType = _.find(this.definedTypeCodes, (definedTypeCode: Coding) => definedTypeCode.code === code);

        if (foundType) {
            return foundType.display;
        }

        return '';
    }

    getDefaultBinding(): ElementDefinitionBindingComponent {
        return new ElementDefinitionBindingComponent({strength: 'required'});
    }

    ngOnInit() {
        this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
        this.types = this.getTypes();
    }
}
