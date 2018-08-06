import {ElementDefinition, ElementDefinitionBindingComponent, ResourceReference, TypeRefComponent} from './fhir';
import {ElementDef} from '@angular/core/src/view';
import {Globals} from '../globals';
import * as _ from 'underscore';

export class ElementTreeModel {
    public constrainedElement: ElementDefinition;
    public baseElement: ElementDefinition;
    public depth: number;
    public expanded: boolean;
    public hasChildren: boolean;
    public position: number;
    public parent: ElementTreeModel;

    constructor() {
    }

    get displayId(): string {
        let leafId = this.id;

        if (leafId.indexOf('.') > 0) {
            leafId = leafId.substring(leafId.lastIndexOf('.') + 1);
        }

        if (leafId.indexOf(':') > 0) {
            leafId = leafId.substring(leafId.indexOf(':') + 1);
        }

        return leafId;
    }

    get id(): string {
        if (this.constrainedElement) {
            return this.constrainedElement.id;
        } else if (this.baseElement) {
            return this.baseElement.id;
        }

        return '';
    }

    get leafPath(): string {
        const element = this.constrainedElement || this.baseElement;

        if (element) {
            return element.path.substring(element.path.lastIndexOf('.') + 1);
        }

        return '';
    }

    get isSliceRoot(): boolean {
        const element = this.constrainedElement || this.baseElement;

        if (element && element.sliceName) {
            return element.id.endsWith(':' + element.sliceName);
        }

        return false;
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

    private getTypeRefDisplay(typeRefs: TypeRefComponent[]): string {
        const typeCounts = {};

        _.each(typeRefs, (type: TypeRefComponent) => {
            if (typeCounts.hasOwnProperty(type.code)) {
                typeCounts[type.code]++;
            } else {
                typeCounts[type.code] = 1;
            }
        });

        const types = Object.keys(typeCounts);

        for (let i = 0; i < types.length; i++) {
            const type = types[i];

            if (typeCounts[type] > 1) {
                types[i] = type + '+';
            }
        }

        return types.join(', ');
    }

    get type(): string {
        const constrainedElement = this.constrainedElement;

        if (constrainedElement && constrainedElement.type && constrainedElement.type.length > 0) {
            return this.getTypeRefDisplay(constrainedElement.type);
        }

        if (!this.baseElement.type) {
            return '';
        }

        return this.getTypeRefDisplay(this.baseElement.type);
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
    
    private getBindingComponentDisplay(component: ElementDefinitionBindingComponent) {
        if (!component) {
            return '';
        }

        let valueSetDisplay;

        if (component.valueSetUri) {
            valueSetDisplay = component.valueSetUri;
        } else if (component.valueSetReference) {
            if (component.valueSetReference.reference && component.valueSetReference.display) {
                valueSetDisplay = component.valueSetReference.reference + ' (' + component.valueSetReference.display + ')';
            } else if (component.valueSetReference.reference) {
                valueSetDisplay = component.valueSetReference.reference;
            } else if (component.valueSetReference.display) {
                valueSetDisplay = component.valueSetReference.display;
            }
        }

        if (component.strength && valueSetDisplay) {
            return component.strength + ' ' + valueSetDisplay;
        } else if (valueSetDisplay) {
            return valueSetDisplay;
        } else if (component.strength) {
            return component.strength;
        }

        return '';
    }

    private getBindingDisplay(element: ElementDefinition): string {
        let display = this.getBindingComponentDisplay(element.binding);
        const fixedPropertyName = Globals.getChoiceSelectionName(element, 'fixed');
        const patternPropertyName = Globals.getChoiceSelectionName(element, 'pattern');
        const defaultValueName = Globals.getChoiceSelectionName(element, 'defaultValue');
        const exampleName = Globals.getChoiceSelectionName(element, 'example');

        if (fixedPropertyName) {
            if (display) {
                display += '\r\n';
            }
            display += fixedPropertyName;
        }

        if (patternPropertyName) {
            if (display) {
                display += '\r\n';
            }
            display += patternPropertyName;
        }

        if (defaultValueName) {
            if (display) {
                display += '\r\n';
            }
            display += defaultValueName;
        }

        if (exampleName) {
            if (display) {
                display += '\r\n';
            }
            display += exampleName;
        }

        return display;
    }

    get binding(): string {
        if (this.constrainedElement) {
            return this.getBindingDisplay(this.constrainedElement);
        }

        return this.getBindingDisplay(this.baseElement);
    }
}
