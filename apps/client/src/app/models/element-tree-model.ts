import {ElementDefinition as STU3ElementDefinition, ElementDefinitionBindingComponent, StructureDefinition, TypeRefComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  ElementDefinition as R4ElementDefinition, ElementDefinitionElementDefinitionBindingComponent,
  ElementDefinitionTypeRefComponent
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';

export class ElementTreeModel {
  public constrainedElement?: STU3ElementDefinition | R4ElementDefinition;
  public baseElement: STU3ElementDefinition | R4ElementDefinition;
  public depth: number;
  public expanded = false;
  public hasChildren = false;
  public position: number;
  public parent?: ElementTreeModel;
  public profile: StructureDefinition;
  public profilePath: string;
  public path: string;

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

  get basePath(): string {
    if (this.baseElement) {
      return this.baseElement.path;
    }
  }

  get constrainedPath(): string {
    if (this.constrainedElement) {
      return this.constrainedElement.path;
    }
  }

  get baseId(): string {
    if (this.baseElement) {
      return this.baseElement.id;
    }
  }

  get constrainedId(): string {
    if (this.constrainedElement) {
      return this.constrainedElement.id;
    }
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

  private getTypeRefDisplay(typeRefs: (TypeRefComponent | ElementDefinitionTypeRefComponent)[]): string {
    const typeCounts = {};

    typeRefs.forEach((type: TypeRefComponent | ElementDefinitionTypeRefComponent) => {
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
    const types = <(TypeRefComponent | ElementDefinitionTypeRefComponent)[]> (this.constrainedElement ? this.constrainedElement.type : this.baseElement.type);
    if (types) {
      const uniqueTypes: string[] = types.reduce((previous, current) => {
        if (previous.indexOf(current.code) < 0) {
          previous.push(current.code);
        }
        return previous;
      }, []);

      if (uniqueTypes.length === 1) {
        return uniqueTypes[0];
      }
    }
  }

  get typeDisplay(): string {
    const constrainedElement = this.constrainedElement;

    if (constrainedElement && constrainedElement.type && constrainedElement.type.length > 0) {
      return this.getTypeRefDisplay(<(TypeRefComponent | ElementDefinitionTypeRefComponent)[]> constrainedElement.type);
    }

    if (!this.baseElement.type) {
      return '';
    }
    return this.getTypeRefDisplay(<(TypeRefComponent | ElementDefinitionTypeRefComponent)[]> (<STU3ElementDefinition | R4ElementDefinition> this.baseElement).type);
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
    for (let x = 1; x < this.depth; x++) {
      tabs += '    ';
    }
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

  private getBindingComponentDisplay(component: ElementDefinitionBindingComponent | ElementDefinitionElementDefinitionBindingComponent) {
    if (!component) {
      return '';
    }

    let valueSetDisplay;
    //STU3 display data
    if (component && (<ElementDefinitionBindingComponent> component).valueSetUri) {
      valueSetDisplay = (<ElementDefinitionBindingComponent> component).valueSetUri;
    } else if (component && (<ElementDefinitionBindingComponent> component).valueSetReference) {
      if ((<ElementDefinitionBindingComponent> component).valueSetReference.reference && (<ElementDefinitionBindingComponent> component).valueSetReference.display) {
        valueSetDisplay = (<ElementDefinitionBindingComponent> component).valueSetReference.reference + ' (' + (<ElementDefinitionBindingComponent> component).valueSetReference.display + ')';
      } else if ((<ElementDefinitionBindingComponent> component).valueSetReference.reference) {
        valueSetDisplay = (<ElementDefinitionBindingComponent> component).valueSetReference.reference;
      } else if ((<ElementDefinitionBindingComponent> component).valueSetReference.display) {
        valueSetDisplay = (<ElementDefinitionBindingComponent> component).valueSetReference.display;
      }
    }

    //R4 display data
    else if (component && (<ElementDefinitionElementDefinitionBindingComponent> component).valueSet) {
      valueSetDisplay = (<ElementDefinitionElementDefinitionBindingComponent> component).valueSet;
    }

    if (component && component.strength && valueSetDisplay) {
      return component.strength + ' ' + valueSetDisplay;
    } else if (valueSetDisplay) {
      return valueSetDisplay;
    } else if (component.strength) {
      return component.strength;
    }


    return '';
  }

  private getBindingDisplay(element: STU3ElementDefinition | R4ElementDefinition): string {
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

    const elementTypes = <(TypeRefComponent | ElementDefinitionTypeRefComponent)[]> element.type;
    if(elementTypes){
      elementTypes.forEach(e => {
        // append the last 15 characters to display
        if (e.targetProfile) {
          if(e.targetProfile instanceof Array){
            e.targetProfile.forEach(tp => {
              if(display) display += ", ";
              display += tp.toString().substring(tp.lastIndexOf("/") + 1);
            });
          }
          else{
            if(display) display += ", ";
            display += e.targetProfile.toString().substring(e.targetProfile.lastIndexOf("/") + 1);
          }
        }
        else if (e.profile){
          if(e.profile instanceof Array){
            e.profile.forEach(p => {
              if(display) display += ", ";
              display += p.toString().substring(p.lastIndexOf("/") + 1);
            });
          }
          else{
            if(display) display += ", ";
            display += e.profile.toString().substring(e.profile.lastIndexOf("/") + 1);
          }
        }
      });
    }

    return display;
  }

  get constraints(): string {
    //Change this to grab the valueset
    if (this.constrainedElement) {
      return this.getBindingDisplay(this.constrainedElement);
    }

    return this.getBindingDisplay(this.baseElement);
  }
}
