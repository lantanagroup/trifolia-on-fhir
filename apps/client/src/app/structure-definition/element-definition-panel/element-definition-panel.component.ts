import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {STU3TypeModalComponent} from './stu3-type-modal/type-modal.component';
import {Globals} from '../../globals';
import {ElementTreeModel} from '../../models/element-tree-model';
import {
    Coding,
    ElementDefinition,
    ElementDefinitionBindingComponent,
    StructureDefinition,
    TypeRefComponent
} from '../../models/stu3/fhir';
import * as _ from 'underscore';
import {FhirService} from '../../shared/fhir.service';
import {MappingModalComponent} from './mapping-modal/mapping-modal.component';
import {ConfigService} from '../../shared/config.service';
import {R4TypeModalComponent} from './r4-type-modal/type-modal.component';

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
    public definedTypeCodes: Coding[] = [];
    public Globals = Globals;

    constructor(
        private modalService: NgbModal,
        private fhirService: FhirService,
        public configService: ConfigService) {

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
        let modalRef;

        if (this.configService.isFhirSTU3) {
            modalRef = this.modalService.open(STU3TypeModalComponent);
        } else if (this.configService.isFhirR4) {
            modalRef = this.modalService.open(R4TypeModalComponent);
        } else {
            throw new Error('Unexpected FHIR version. Cannot open "type" modal popup.');
        }

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

    ngOnInit() {
        this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
    }
}
