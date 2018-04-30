import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {StructureDefinitionService} from '../services/structure-definition.service';
import {ConfigService} from '../services/config.service';
import * as _ from 'underscore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SelectChoiceModalComponent} from '../select-choice-modal/select-choice-modal.component';
import {Globals} from '../globals';
import {ElementTreeModel} from '../models/element-tree-model';

@Component({
    selector: 'app-profile',
    templateUrl: './structure-definition.component.html',
    styleUrls: ['./structure-definition.component.css'],
    providers: [StructureDefinitionService]
})
export class StructureDefinitionComponent implements OnInit {
    public structureDefinition;
    public baseStructureDefinition;
    public elements = [];
    public selectedElement: any;

    constructor(private route: ActivatedRoute,
                private strucDefService: StructureDefinitionService,
                public configService: ConfigService,
                private modalService: NgbModal,
                public globals: Globals) {

    }

    public toggleSelectedElement(element: any) {
        if (!element || this.selectedElement === element) {
            this.selectedElement = null;
        } else {
            this.selectedElement = element;
        }
    }

    public beforeTabChange(event: any) {
        if (event.nextId !== 'elements') {
            this.selectedElement = null;
        }
    }

    public toggleElementExpand(target: ElementTreeModel) {
        if (target.expanded) {
            // TODO: Account for expanding/collapsing slices
            const filtered = _.filter(this.elements, (element: ElementTreeModel) => {
                return element.baseElement.path.startsWith(target.baseElement.path + '.');
            });

            for (let i = filtered.length - 1; i >= 0; i--) {
                const index = this.elements.indexOf(filtered[i]);
                this.elements.splice(index, 1);
            }

            target.expanded = false;
        } else {
            this.populateBaseElements(target);
            target.expanded = true;
        }
    }

    public selectChoice(element: any) {
        const modalRef = this.modalService.open(SelectChoiceModalComponent);
        modalRef.componentInstance.structureDefinition = this.baseStructureDefinition;
        modalRef.componentInstance.element = element;

        modalRef.result.then((selectedType) => {

        });
    }

    public populateElement(element: ElementTreeModel) {
        return [element];
    }

    public populateConstrainedElements(elementTreeModels: ElementTreeModel[]) {
        for (let i = 0; i < elementTreeModels.length; i++) {
            const elementTreeModel = elementTreeModels[i];
            const constrainedElements = _.filter(this.structureDefinition.differential.element, (diffElement) =>
                diffElement.path === elementTreeModel.baseElement.path);

            for (let x = 0; x < constrainedElements.length; x++) {
                let newElementTreeModel = elementTreeModel;

                if (x > 0) {
                    newElementTreeModel = new ElementTreeModel();
                    Object.assign(newElementTreeModel, elementTreeModel);
                    elementTreeModels.splice(i + x, 0, newElementTreeModel);
                }

                newElementTreeModel.constrainedElement = constrainedElements[x];
            }
        }
    }

    public populateBaseElements(parent?: ElementTreeModel) {
        // If no parent, then asking to populate the top-level, which is only
        // performed during a refresh
        if (!parent) {
            this.elements = [];
        }

        let nextIndex = parent ? this.elements.indexOf(parent) + 1 : 0;
        const parentPath = parent ? parent.baseElement.path : '';
        let filtered;

        if (parent && parent.baseElement.path.endsWith('[x]')) {
            // this is a choice element, the child elements are the types of the choice
            filtered = _.map(parent.baseElement.type, (type) => {
                return {
                    path: parent.baseElement.path.substring(0, parent.baseElement.path.lastIndexOf('[x]')) + type.code
                };
            });
        } else {
            // this is not a choice element, just need to find the children of the parent
            filtered = _.filter(this.baseStructureDefinition.snapshot.element, (baseElement) => {
                if (parentPath) {
                    return baseElement.path.startsWith(parentPath + '.') &&
                        baseElement.path.split('.').length === (parentPath.split('.').length + 1);
                } else {
                    return baseElement.path === this.structureDefinition.type;
                }
            });
        }

        for (let i = 0; i < filtered.length; i++) {
            const depth = parent ? parent.depth + 1 : 1;
            const hasChildren = _.filter(this.baseStructureDefinition.snapshot.element, (element) => {
                return element.path.startsWith(filtered[i].path + '.') &&
                    element.path.split('.').length === (filtered[i].path.split('.').length + 1);
            }).length > 0;

            const newElement = new ElementTreeModel();
            newElement.setFields(filtered[i], parent ? parent.depth + 1 : 1, hasChildren);

            const newElements = this.populateElement(newElement);
            this.populateConstrainedElements(newElements);

            for (let x = 0; x < newElements.length; x++) {
                this.elements.splice(nextIndex, 0, newElements[x]);
                nextIndex++;
            }
        }

        if (parentPath === '' && this.elements.length === 1) {
            this.toggleElementExpand(this.elements[0]);
        }
    }

    public getTypeDisplay(element: ElementTreeModel) {
        if (!element.baseElement.type) {
            return '';
        }

        return _.map(element.baseElement.type, (type) => {
            return type.code;
        }).join(', ');
    }

    private getStructureDefinition() {
        const strucDefId = this.route.snapshot.paramMap.get('id');

        this.configService.setStatusMessage('Loading structure definition');
        this.structureDefinition = null;
        this.elements = [];

        this.strucDefService.getStructureDefinition(strucDefId)
            .mergeMap((structureDefinition: any) => {
                this.structureDefinition = structureDefinition;
                this.configService.setStatusMessage('Loading base structure definition');
                return this.strucDefService.getBaseStructureDefinition(structureDefinition.type);
            })
            .subscribe(baseStructureDefinition => {
                this.baseStructureDefinition = baseStructureDefinition;
                this.populateBaseElements();
                this.configService.setStatusMessage('');
            }, error => {
                this.configService.setStatusMessage('Error loading structure definitions: ' + error);
            });
    }

    public constrainElement(element: ElementTreeModel) {

    }

    public sliceElement(element: ElementTreeModel) {

    }

    public removeElement(element: ElementTreeModel) {

    }

    public cardinalityAllowsMultiple(max: string) {
        return max !== '0' && max !== '1';
    }

    ngOnInit() {
        this.getStructureDefinition();
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getStructureDefinition());
    }

    save() {

    }
}
