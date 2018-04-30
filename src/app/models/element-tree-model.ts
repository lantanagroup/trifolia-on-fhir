import {ElementDefinition} from './fhir';
import {ElementDef} from '@angular/core/src/view';

export class ElementTreeModel {
    public id: string;
    public constrainedElement: ElementDefinition;
    public baseElement: ElementDefinition;
    public depth: number;
    public expanded: boolean;
    public tabs = '';
    public hasChildren: boolean;

    constructor(id?: string) {
        this.id = id;
    }

    setFields(baseElement: ElementDefinition, depth: number, hasChildren: boolean, constrainedElement?: ElementDefinition) {
        this.id = baseElement.path.substring(baseElement.path.lastIndexOf('.') + 1);
        this.baseElement = baseElement;
        this.depth = depth;
        this.hasChildren = hasChildren;

        for (let x = 1; x < this.depth; x++) { this.tabs += '    '; }
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
