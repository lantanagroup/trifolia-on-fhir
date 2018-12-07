import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirElementDefinitionTypeModalComponent} from '../fhir-edit/element-definition-type-modal/element-definition-type-modal.component';
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
import {FhirReferenceModalComponent} from '../fhir-edit/reference-modal/reference-modal.component';
import {MappingModalComponent} from './mapping-modal/mapping-modal.component';

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
    public definedTypeCodes: Coding[] = [];

    constructor(
        private modalService: NgbModal,
        private fhirService: FhirService,
        public globals: Globals) {

    }

    get element(): ElementDefinition {
        if (this.elementTreeModel) {
            return this.elementTreeModel.constrainedElement;
        }
    }

    editMappings() {
        const modalRef = this.modalService.open(MappingModalComponent, { size: 'lg' });
        modalRef.componentInstance.mappings = this.element.mapping;
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
        const modalRef = this.modalService.open(FhirElementDefinitionTypeModalComponent);
        modalRef.componentInstance.element = element;
        modalRef.componentInstance.type = type;
    }

    selectTypeProfile(type: TypeRefComponent) {
        const modalRef = this.modalService.open(FhirReferenceModalComponent, { size: 'lg' });
        modalRef.componentInstance.resourceType = 'StructureDefinition';
        modalRef.componentInstance.hideResourceType = true;

        modalRef.result.then((results) => {
            type.targetProfile = results.resource.url;
        });
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
        const baseTypes = this.elementTreeModel.baseElement.type;
        const elementTreeModelTypes = this.element.type ? this.element.type : [];

        const filtered = _.filter(baseTypes, (baseType: TypeRefComponent) => {
            const typeAlreadySelected = _.find(elementTreeModelTypes, (type: TypeRefComponent) => type.code === baseType.code);
            return !typeAlreadySelected;        // Only return definedTypeCodes that are no found in the list of types in the element
        });

        return filtered;
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
    }

    getDefaultBinding(): ElementDefinitionBindingComponent {
        return new ElementDefinitionBindingComponent({strength: 'required'});
    }

    ngOnInit() {
        this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
    }
}
