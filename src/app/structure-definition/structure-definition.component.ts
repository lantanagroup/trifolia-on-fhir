import {Component, DoCheck, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {StructureDefinitionService} from '../services/structure-definition.service';
import {ConfigService} from '../services/config.service';
import * as _ from 'underscore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SelectChoiceModalComponent} from '../select-choice-modal/select-choice-modal.component';
import {Globals} from '../globals';
import {ElementTreeModel} from '../models/element-tree-model';
import {ElementDefinition, StructureDefinition, ValueSet} from '../models/fhir';
import {ElementDef} from '@angular/core/src/view';
import {DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {RecentItemModel} from '../models/recent-item-model';
import {CookieService} from 'angular2-cookie/core';
import {RecentItemService} from '../services/recent-item.service';
import {FhirService} from '../services/fhir.service';

@Component({
    selector: 'app-profile',
    templateUrl: './structure-definition.component.html',
    styleUrls: ['./structure-definition.component.css'],
    providers: [StructureDefinitionService, FhirService]
})
export class StructureDefinitionComponent implements OnInit, OnDestroy, DoCheck {
    @Input() public structureDefinition: StructureDefinition;
    public baseStructureDefinition;
    public elements = [];
    public selectedElement: any;
    public validation: any;
    public message: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private strucDefService: StructureDefinitionService,
                public configService: ConfigService,
                private modalService: NgbModal,
                public globals: Globals,
                private recentItemService: RecentItemService,
                private fhirService: FhirService,
                @Inject(DOCUMENT) private document: Document) {
        this.document.body.classList.add('structure-definition');
    }

    ngOnDestroy() {
        this.document.body.classList.remove('structure-definition');
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

    private removeElementTreeChildren(target: ElementTreeModel) {
        const filtered = _.filter(this.elements, (element: ElementTreeModel) => {
            return element.parent === target;
        });

        for (let i = filtered.length - 1; i >= 0; i--) {
            this.removeElementTreeChildren(filtered[i]);

            const index = this.elements.indexOf(filtered[i]);
            this.elements.splice(index, 1);
        }
    }

    public toggleElementExpand(target: ElementTreeModel) {
        if (!target.hasChildren) {
            return;
        }

        if (target.expanded) {
            this.removeElementTreeChildren(target);
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

    public populateConstrainedElements(elementTreeModels: ElementTreeModel[], sliceName: string) {
        for (let i = 0; i < elementTreeModels.length; i++) {
            const elementTreeModel = elementTreeModels[i];
            const constrainedElements = _.filter(this.structureDefinition.differential.element, (diffElement) => {
                const diffElementSliceName = diffElement.id && diffElement.id.indexOf(':') > 0 ?
                        diffElement.id.substring(diffElement.id.indexOf(':') + 1) :
                        null;

                if (sliceName !== diffElementSliceName) {
                    return false;
                }

                return diffElement.path === elementTreeModel.baseElement.path;
            });

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
        const parentSliceName = parent && parent.id.indexOf(':') > 0 ? parent.id.substring(parent.id.indexOf(':') + 1) : null;
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
            const position = this.baseStructureDefinition.snapshot.element.indexOf(filtered[i]);
            const depth = parent ? parent.depth + 1 : 1;
            const hasChildren = _.filter(this.baseStructureDefinition.snapshot.element, (element) => {
                return element.path.startsWith(filtered[i].path + '.') &&
                    element.path.split('.').length === (filtered[i].path.split('.').length + 1);
            }).length > 0;

            const newElement = new ElementTreeModel();
            newElement.parent = parent;
            newElement.setFields(filtered[i], parent ? parent.depth + 1 : 1, hasChildren, position);
            newElement.setId();

            const newElements = this.populateElement(newElement);
            this.populateConstrainedElements(newElements, parentSliceName);

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

    private getStructureDefinition(): Observable<null> {
        const strucDefId = this.route.snapshot.paramMap.get('id');

        this.configService.setStatusMessage('Loading structure definition');
        this.structureDefinition = null;
        this.elements = [];

        return new Observable((observer) => {
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
                    observer.next();
                }, error => {
                    this.configService.handleError('Error loading structure definitions.', error);
                    observer.error(error);
                });
        });
    }

    public constrainElement(elementTreeModel: ElementTreeModel) {
        const parentSliceName = elementTreeModel.parent.constrainedElement.sliceName;
        const constrainedElement = new ElementDefinition();
        constrainedElement.id = elementTreeModel.baseElement.path;
        constrainedElement.path = elementTreeModel.baseElement.path;

        if (parentSliceName) {
            constrainedElement.id += ':' + parentSliceName;
        }

        // Set the constrainedElement on the treeModel
        elementTreeModel.constrainedElement = constrainedElement;

        // Add the element to the SD's differential elements, and sort the list so that it matches the base model's order
        this.structureDefinition.differential.element.push(constrainedElement);
        this.structureDefinition.differential.element = _.sortBy(this.structureDefinition.differential.element, (element) => {
            const foundElementTreeModel = _.find(this.elements, (nextElementTreeModel) =>
                nextElementTreeModel.constrainedElement === element);
            return foundElementTreeModel.position;
        });

        this.toggleSelectedElement(elementTreeModel);
    }

    private isChildOfElement(target: ElementTreeModel, parent: ElementTreeModel): boolean {
        let current = target.parent;

        while (current) {
            if (current === parent) {
                return true;
            }

            current = current.parent;
        }

        return false;
    }

    public sliceElement(elementTreeModel: ElementTreeModel) {
        // Collapse the element so the tree doesn't look screwed up when we mess with it
        if (elementTreeModel.expanded) {
            this.toggleElementExpand(elementTreeModel);
        }

        elementTreeModel.constrainedElement.slicing = {
            rules: 'open'
        };

        const newSliceName = 'slice' + (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString();
        const newElement = new ElementDefinition();
        newElement.id = elementTreeModel.constrainedElement.id + ':' + newSliceName;
        newElement.path = elementTreeModel.constrainedElement.path;
        newElement.sliceName = newSliceName;

        const elementIndex = this.structureDefinition.differential.element.indexOf(elementTreeModel.constrainedElement);
        this.structureDefinition.differential.element.splice(elementIndex + 1, 0, newElement);

        const newElementTreeModel = new ElementTreeModel();
        newElementTreeModel.setFields(
            elementTreeModel.baseElement,
            elementTreeModel.depth,
            elementTreeModel.hasChildren,
            elementTreeModel.position,
            newElement);
        newElementTreeModel.setId(newSliceName);
        newElementTreeModel.expanded = false;
        newElementTreeModel.isSliceRoot = true;

        const elementTreeModelIndex = this.elements.indexOf(elementTreeModel);

        // Include any children of the current elementTreeModel in the index
        for (let i = elementTreeModelIndex + 1; i < this.elements.length; i++) {
            const nextElementTreeModel = this.elements[i];
            if (this.isChildOfElement(nextElementTreeModel, elementTreeModel)) {
                nextElementTreeModel.parent = newElementTreeModel;
                nextElementTreeModel.id = nextElementTreeModel.id + ':' + newSliceName;
                nextElementTreeModel.constrainedElement.id = nextElementTreeModel.constrainedElement.id + ':' + newSliceName;
                break;
            }
        }

        this.elements.splice(elementTreeModelIndex + 1, 0, newElementTreeModel);
    }

    public removeElementDefinition(element: ElementDefinition) {
        const childElementDefinitions = this.getChildElementDefinitions(element);

        _.each(childElementDefinitions, (childElementDefinition) => this.removeElementDefinition(childElementDefinition));

        const elementIndex = this.structureDefinition.differential.element.indexOf(element);
        this.structureDefinition.differential.element.splice(elementIndex, 1);

        const foundElementTreeModel = _.find(this.elements, (elementTreeModel: ElementTreeModel) =>
            elementTreeModel.constrainedElement === element);

        if (foundElementTreeModel) {
            foundElementTreeModel.constrainedElement = null;
        }

        // Collapse the element tree model now that it is removed
        if (foundElementTreeModel.expanded) {
            this.toggleElementExpand(foundElementTreeModel);
        }

        // If it is a slice root, remove the element tree model entirely
        if (foundElementTreeModel.isSliceRoot) {
            const foundElementTreeModelIndex = this.elements.indexOf(foundElementTreeModel);
            this.elements.splice(foundElementTreeModelIndex, 1);
        }
    }

    private getChildElementDefinitions(element: ElementDefinition): ElementDefinition[] {
        const elementId = element.id;
        const sliceName = elementId.indexOf(':') >= 0 ? elementId.substring(elementId.indexOf(':') + 1) : '';

        const filtered = _.filter(this.structureDefinition.differential.element, (nextElement) => {
            const isBase = nextElement.id.startsWith(elementId + '.');
            const isLeaf = nextElement.id.split('.').length === elementId.split('.').length + 1;
            const isSlice = nextElement.id.endsWith(':' + sliceName);

            if (!isBase || !isLeaf) {
                return false;
            }

            if (sliceName && !isSlice) {
                return false;
            }

            return true;
        });

        return filtered;
    }

    public cardinalityAllowsMultiple(max: string) {
        return max !== '0' && max !== '1';
    }

    ngOnInit() {
        this.getStructureDefinition()
            .subscribe(() => {
                this.recentItemService.ensureRecentItem(
                    this.globals.cookieKeys.recentStructureDefinitions,
                    this.structureDefinition.id,
                    this.structureDefinition.name);
            });
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getStructureDefinition());
    }

    save() {
        if (!this.validation.valid && !confirm('This structure definition is not valid, are you sure you want to save?')) {
            return;
        }

        this.strucDefService.save(this.structureDefinition)
            .subscribe((results: StructureDefinition) => {
                if (!this.structureDefinition.id) {
                    this.router.navigate(['/structure-definition/' + results.id]);
                } else {
                    this.recentItemService.ensureRecentItem(this.globals.cookieKeys.recentStructureDefinitions, results.id, results.name);
                    this.message = 'Successfully saved structure definition!';
                    setTimeout(() => { this.message = ''; }, 3000);
                }
            }, (err) => {
                this.message = 'An error occured while saving the structure definition';
            });
    }

    ngDoCheck() {
        if (this.structureDefinition) {
            this.validation = this.fhirService.validate(this.structureDefinition);
        }
    }
}
