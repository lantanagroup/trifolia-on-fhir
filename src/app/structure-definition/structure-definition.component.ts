import {Component, DoCheck, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {GetStructureDefinitionModel, StructureDefinitionOptions, StructureDefinitionService} from '../shared/structure-definition.service';
import * as _ from 'underscore';
import {NgbModal, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../globals';
import {ElementTreeModel} from '../models/element-tree-model';
import {DifferentialComponent, ElementDefinition, StructureDefinition} from '../models/stu3/fhir';
import {RecentItemService} from '../shared/recent-item.service';
import {FhirService} from '../shared/fhir.service';
import {FileService} from '../shared/file.service';
import {DOCUMENT} from '@angular/common';
import {ConfigService} from '../shared/config.service';
import 'rxjs-compat/add/operator/mergeMap';

@Component({
    selector: 'app-profile',
    templateUrl: './structure-definition.component.html',
    styleUrls: ['./structure-definition.component.css']
})
export class StructureDefinitionComponent implements OnInit, OnDestroy, DoCheck {
    @Input() public structureDefinition: StructureDefinition;
    public options = new StructureDefinitionOptions();
    public baseStructureDefinition;
    public elements = [];
    public selectedElement: any;
    public validation: any;
    public message: string;
    public sdNotFound = false;
    public Globals = Globals;

    @ViewChild('sdTabs')
    public sdTabs: NgbTabset;

    private navSubscription: any;

    constructor(
        public route: ActivatedRoute,
        private router: Router,
        private configService: ConfigService,
        private strucDefService: StructureDefinitionService,
        private modalService: NgbModal,
        private recentItemService: RecentItemService,
        private fhirService: FhirService,
        private fileService: FileService,
        @Inject(DOCUMENT) private document: Document) {

        this.document.body.classList.add('structure-definition');
    }

    ngOnDestroy() {
        this.document.body.classList.remove('structure-definition');
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
        this.configService.setTitle(null);
    }

    public get isFile(): boolean {
        return this.route.snapshot.paramMap.get('id') === 'from-file';
    }

    public toggleSelectedElement(element?: ElementTreeModel) {
        if (!element || this.selectedElement === element) {
            this.selectedElement = null;
        } else if (element && element.constrainedElement) {
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

    public populateElement(element: ElementTreeModel) {
        return [element];
    }

    public nameChanged() {
        this.configService.setTitle(`StructureDefinition - ${this.structureDefinition.title || this.structureDefinition.name || 'no-name'}`);
    }

    public populateConstrainedElements(elementTreeModels: ElementTreeModel[], sliceName: string) {
        for (let i = 0; i < elementTreeModels.length; i++) {
            const elementTreeModel = elementTreeModels[i];
            const parentId = elementTreeModel.parent ? elementTreeModel.parent.id : '';
            const thisId = parentId ? parentId + '.' + elementTreeModel.leafPath : elementTreeModel.leafPath;
            const constrainedElements = _.filter(this.structureDefinition.differential.element,(element) => {
                if (element.id === thisId) {
                    // The element is constrained
                    return true;
                } else if (element.id.startsWith(thisId + ':')) {
                    // the element is constrained with a slice, but we need to make sure the path doesn't represent a child of the slice
                    const after = element.id.substring(thisId.length + 2);
                    return after.indexOf('.') < 0;
                }
                return false;
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

            i += constrainedElements.length;
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
        const parentSliceName = parent && parent.displayId.indexOf(':') > 0 ? parent.displayId.substring(parent.displayId.indexOf(':') + 1) : null;
        let filtered: ElementDefinition[];

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
            const hasChildren = _.filter(this.baseStructureDefinition.snapshot.element, (element: ElementDefinition) => {
                return element.path.startsWith(filtered[i].path + '.') &&
                    element.path.split('.').length === (filtered[i].path.split('.').length + 1);
            }).length > 0;

            const newElement = new ElementTreeModel();
            newElement.parent = parent;
            newElement.setFields(filtered[i], parent ? parent.depth + 1 : 1, hasChildren, position);

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

    private getStructureDefinition() {
        const sdId = this.route.snapshot.paramMap.get('id');

        this.message = 'Loading structure definition...';
        this.structureDefinition = null;
        this.elements = [];

        this.strucDefService.getStructureDefinition(sdId)
            .mergeMap((results: GetStructureDefinitionModel) => {
                if (!results.resource || results.resource.resourceType !== 'StructureDefinition') {
                    throw new Error('The requested StructureDefinition either does not exist or has been deleted');
                }

                this.structureDefinition = results.resource;
                this.options = results.options;
                this.nameChanged();

                if (!this.structureDefinition.differential) {
                    this.structureDefinition.differential = new DifferentialComponent({ element: [] });
                }

                if (this.structureDefinition.differential.element.length === 0) {
                    this.structureDefinition.differential.element.push({
                        id: this.structureDefinition.type,
                        path: this.structureDefinition.type
                    });
                }

                this.message = 'Loading base structure definition...';
                return this.strucDefService.getBaseStructureDefinition(this.structureDefinition.type);
            })
            .subscribe(baseStructureDefinition => {
                this.baseStructureDefinition = baseStructureDefinition;
                this.populateBaseElements();
                this.recentItemService.ensureRecentItem(
                    Globals.cookieKeys.recentStructureDefinitions,
                    this.structureDefinition.id,
                    this.structureDefinition.name);
                this.message = 'Done loading structure definition';
            }, (err) => {
                this.sdNotFound = err.status === 404;
                this.message = this.fhirService.getErrorString(err);
                this.recentItemService.removeRecentItem(Globals.cookieKeys.recentStructureDefinitions, sdId);
            });
    }

    public constrainElement(elementTreeModel: ElementTreeModel, event?: any) {
        const leafElementName = elementTreeModel.baseElement.id.substring(elementTreeModel.baseElement.id.lastIndexOf('.') + 1);
        const constrainedElement = new ElementDefinition();
        constrainedElement.id = elementTreeModel.parent ?
            `${elementTreeModel.parent.id}.${leafElementName}` :
            elementTreeModel.baseElement.path;
        constrainedElement.path = elementTreeModel.baseElement.path;

        // Set the constrainedElement on the treeModel
        elementTreeModel.constrainedElement = constrainedElement;

        // Add the element to the SD's differential elements
        this.structureDefinition.differential.element.push(constrainedElement);

        if (this.selectedElement !== elementTreeModel) {
            this.toggleSelectedElement(elementTreeModel);
        }

        event.preventDefault();

        // sort the list so that it matches the base model's order
        this.structureDefinition.differential.element = _.sortBy(this.structureDefinition.differential.element, (element) => {
            const foundElementTreeModel = _.find(this.elements, (nextElementTreeModel) =>
                nextElementTreeModel.constrainedElement === element);

            // TODO: Fix bug. not ever differential element has an entry in the tree models (child entries not expanded, for example)
            return foundElementTreeModel.position;
        });
    }

    public hasSlices(elementTreeModel: ElementTreeModel) {
        if (!elementTreeModel.constrainedElement || !elementTreeModel.constrainedElement.slicing) {
            return;
        }

        const found = _.filter(this.structureDefinition.differential.element, (element) => {
            return element.id.indexOf(elementTreeModel.id + ':') === 0;
        });

        return found.length > 0;
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
        newElementTreeModel.expanded = false;

        const elementTreeModelIndex = this.elements.indexOf(elementTreeModel);

        // Include any children of the current elementTreeModel in the index
        for (let i = elementTreeModelIndex + 1; i < this.elements.length; i++) {
            const nextElementTreeModel = this.elements[i];
            if (this.isChildOfElement(nextElementTreeModel, elementTreeModel)) {
                nextElementTreeModel.parent = newElementTreeModel;
                nextElementTreeModel.displayId = nextElementTreeModel.displayId + ':' + newSliceName;
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
        const isSliceRoot = foundElementTreeModel ? foundElementTreeModel.isSliceRoot : false;

        if (foundElementTreeModel) {
            foundElementTreeModel.constrainedElement = null;
        }

        // Collapse the element tree model now that it is removed
        if (foundElementTreeModel.expanded) {
            this.toggleElementExpand(foundElementTreeModel);
        }

        // If it is a slice root, remove the element tree model entirely
        if (isSliceRoot) {
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

    public revert() {
        if (!confirm('Are you sure you want to revert your changes to the profile?')) {
            return;
        }

        this.getStructureDefinition();
    }

    public save() {
        if (!this.validation.valid && !confirm('This structure definition is not valid, are you sure you want to save?')) {
            return;
        }

        if (this.isFile) {
            this.fileService.saveFile();
            return;
        }

        this.strucDefService.save(this.structureDefinition, this.options)
            .subscribe((results: StructureDefinition) => {
                if (!this.structureDefinition.id) {
                    this.router.navigate(['/structure-definition/' + results.id]);
                } else {
                    if (this.options && this.options.implementationGuides) {
                        const removedImplementationGuides = _.filter(this.options.implementationGuides, (implementationGuide) => implementationGuide.isRemoved);
                        for (let i = removedImplementationGuides.length - 1; i > 0; i--) {
                            const index = this.options.implementationGuides.indexOf(removedImplementationGuides[i]);
                            this.options.implementationGuides.splice(index, 1);
                        }
                        _.each(this.options.implementationGuides, (implementationGuide) => implementationGuide.isNew = false);
                    }

                    this.recentItemService.ensureRecentItem(Globals.cookieKeys.recentStructureDefinitions, results.id, results.name);
                    this.message = 'Your changes have been saved!';
                    setTimeout(() => { this.message = ''; }, 3000);
                }
            }, (err) => {
                this.message = this.fhirService.getErrorString(err);
            });
    }

    ngOnInit() {
        this.navSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd && e.url.startsWith('/structure-definition/')) {
                this.getStructureDefinition();
            }
        });
        this.getStructureDefinition();
    }

    ngDoCheck() {
        if (this.structureDefinition) {
            this.validation = this.fhirService.validate(this.structureDefinition);
        }
    }
}
