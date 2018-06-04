import {ElementDefinition} from './fhir';
import {ElementDef} from '@angular/core/src/view';

export class ElementTreeModel {
    public id: string;
    public constrainedElement: ElementDefinition;
    public baseElement: ElementDefinition;
    public depth: number;
    public expanded: boolean;
    public hasChildren: boolean;
    public position: number;
    public parent: ElementTreeModel;
    public isSliceRoot: boolean;

    constructor(id?: string) {
        this.id = id;
    }

    setId(sliceName?: string) {
        this.id = this.baseElement.path.substring(this.baseElement.path.lastIndexOf('.') + 1);

        if (sliceName) {
            this.id += ':' + sliceName;
        }

        if (this.constrainedElement) {
            this.constrainedElement.id = this.baseElement.path + ':' + sliceName;
        }
    }

    setFields(baseElement: ElementDefinition, depth: number, hasChildren: boolean, position: number, constrainedElement?: ElementDefinition) {
        this.baseElement = baseElement;
        this.depth = depth;
        this.hasChildren = hasChildren;
        this.position = position;

        if (constrainedElement) {
            this.constrainedElement = constrainedElement;
        }
    }

    get isSlice(): boolean {
        if (!this.constrainedElement) {
            return false;
        }

        const idHasSliceName = this.constrainedElement.id && this.constrainedElement.id.indexOf(':') > 0;
        const hasSliceNameProp = !!this.constrainedElement.sliceName;

        return idHasSliceName || hasSliceNameProp;
    }

    get tabs(): string {
        let tabs = '';
        for (let x = 1; x < this.depth; x++) { tabs += '    '; }
        return tabs;
    }

    get min(): number {
        if (this.constrainedElement && this.constrainedElement.hasOwnProperty('min')) {
            return this.constrainedElement.min;
        }

        return this.baseElement.min;
    }

    get max(): string {
        if (this.constrainedElement && this.constrainedElement.hasOwnProperty('max')) {
            return this.constrainedElement.max;
        }

        return this.baseElement.max;
    }

    private getBindingDisplay(element: ElementDefinition): string {
        if (!element.binding) {
            return '';
        }

        if (element.binding.strength && element.binding.valueSet) {
            return element.binding.strength + ' ' + element.binding.valueSet.toString();
        } else if (element.binding.valueSet) {
            return element.binding.valueSet.toString();
        }
    }

    get binding(): string {
        if (this.constrainedElement) {
            return this.getBindingDisplay(this.constrainedElement);
        }

        return this.getBindingDisplay(this.baseElement);
    }
}
