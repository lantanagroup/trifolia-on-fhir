import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {NgbModal, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {STU3TypeModalComponent} from './stu3-type-modal/type-modal.component';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {ElementTreeModel} from '../../../../../../libs/tof-lib/src/lib/element-tree-model';
import {Coding, ExampleComponent, StructureDefinition, TypeRefComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ElementDefinitionExampleComponent, ElementDefinitionTypeRefComponent} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {FhirService} from '../../shared/fhir.service';
import {MappingModalComponent} from './mapping-modal/mapping-modal.component';
import {ConfigService} from '../../shared/config.service';
import {R4TypeModalComponent} from './r4-type-modal/type-modal.component';
import {IElementDefinition, IElementDefinitionConstraint, IElementDefinitionType} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {ElementDefinitionConstraintComponent} from '../../modals/element-definition-constraint/element-definition-constraint.component';
import {generateId} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {ConstraintManager} from '../../../../../../libs/tof-lib/src/lib/constraint-manager';

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
  @Output() change: EventEmitter<void> = new EventEmitter<void>();
  @Input() constraintManager: ConstraintManager;

  public editingSliceName: boolean;
  public editedSliceName: string;
  public definedTypeCodes: Coding[] = [];
  public Globals = Globals;
  public editingConstraint: IElementDefinitionConstraint;

  @ViewChild('edTabSet', { static: true }) edTabSet: NgbTabset;
  @ViewChild('idTextField', { static: true }) idTextField: ElementRef;

  constructor(
    private modalService: NgbModal,
    private fhirService: FhirService,
    private renderer: Renderer2,
    public configService: ConfigService) {

  }

  get element(): IElementDefinition {
    if (this.elementTreeModel) {
      return this.elementTreeModel.constrainedElement;
    }
  }

  get min(): string {
    if (this.elementTreeModel && this.elementTreeModel.constrainedElement && this.elementTreeModel.constrainedElement.min >= 0) {
      return this.elementTreeModel.constrainedElement.min.toString();
    }

    return '';
  }

  set min(value: string) {
    if (this.element) {
      if (value || value == '0') {
        const valueNum = parseInt(value);
        this.element.min = valueNum;
      } else if (!value) {
        delete this.element.min;
      }
    }
  }

  get max(): string {
    if (this.element && this.element.max) {
      if (this.element.max === '*') {
        return '';
      }

      return this.element.max;
    }

    return '';
  }

  set max(value: string) {
    if (this.element) {
      if (value || value == '0') {
        this.element.max = value.toString();
      } else if (!value && this.element.max) {
        delete this.element.max;
      }
    }
  }

  focus() {
    if (this.edTabSet) {
      this.edTabSet.select('general');
    }

    if (this.idTextField) {
      this.renderer.selectRootElement(this.idTextField.nativeElement).focus();
    }
  }

  async typeChanged(init = false) {
    if (!this.elementTreeModel) return;

    const isExpanded = this.elementTreeModel.expanded;

    if (isExpanded) {
      await this.constraintManager.toggleExpand(this.elementTreeModel);
    }

    const children = await this.constraintManager.findChildren(this.element, this.elementTreeModel.constrainedElement);
    this.elementTreeModel.hasChildren = children.length > 0;

    if (isExpanded && this.elementTreeModel.hasChildren && !init) {
      await this.constraintManager.toggleExpand(this.elementTreeModel);
    }

    this.change.emit();
  }

  async removeType(index: number) {
    this.element.type.splice(index, 1);
    this.typeChanged();
  }

  editMappings() {
    const modalRef = this.modalService.open(MappingModalComponent, {size: 'xl', backdrop: 'static'});
    modalRef.componentInstance.mappings = this.element.mapping;
    modalRef.componentInstance.structureDefinition = this.structureDefinition;

    modalRef.result.then(() => {
      this.change.emit();
    });
  }

  addConstraint() {
    this.element.constraint = this.element.constraint || [];
    this.element.constraint.push({
      key: generateId(),
      severity: 'warning',
      human: ''
    });
  }

  editConstraint(constraint: IElementDefinitionConstraint) {
    const modalRef = this.modalService.open(ElementDefinitionConstraintComponent, { backdrop: 'static' });
    modalRef.componentInstance.constraint = constraint;
    modalRef.result.then(() => {
      this.change.emit();
    });
  }

  addCondition() {
    this.element.condition = this.element.condition || [];
    this.element.condition.push('');
  }

  toggleMaxUnlimited() {
    if (this.element.max === '*') {
      this.element.max = '1';
    } else {
      this.element.max = '*';
    }
  }

  openTypeModal(element, type) {
    let modalRef;

    if (this.configService.isFhirSTU3) {
      modalRef = this.modalService.open(STU3TypeModalComponent, { size: 'lg', backdrop: 'static' });
    } else if (this.configService.isFhirR4) {
      modalRef = this.modalService.open(R4TypeModalComponent, { size: 'lg', backdrop: 'static' });
    } else {
      throw new Error('Unexpected FHIR version. Cannot open "type" modal popup.');
    }

    modalRef.componentInstance.element = element;
    modalRef.componentInstance.type = type;
    modalRef.result.then(async () => {
      await this.typeChanged();
    });
  }

  editedResliceNameValid() {
    if (!this.editingSliceName) return true;

    if (this.elementTreeModel.baseElement.sliceName && this.element.sliceName) {
      const prefix = this.elementTreeModel.baseElement.sliceName + '/';
      if (!this.editedSliceName || !this.editedSliceName.startsWith(prefix)) return false;
      return this.editedSliceName !== prefix;
    }

    return true;
  }

  disableEditSliceName() {
    if (!this.editingSliceName) return false;
    if (!this.editedSliceName) return true;
    if (this.editedSliceName.indexOf(' ') >= 0 || this.editedSliceName.indexOf('.') >= 0) return true;
    return !this.editedResliceNameValid();
  }

  toggleEditSliceName(commit?: boolean) {
    if (this.editingSliceName && commit) {
      let newId = this.element.id.substring(0, this.element.id.lastIndexOf(':'));
      newId = newId + ':' + this.editedSliceName;

      (this.structureDefinition.differential.element || [])
        .filter((nextElement) => {
          return nextElement.id.startsWith(this.element.id + '.');
        })
        .forEach((childElement) => {
          if (childElement.sliceName === this.element.sliceName) {
            childElement.sliceName = this.editedSliceName;
          }

          const newChildElementId = newId + childElement.id.substring(this.element.id.length);
          childElement.id = newChildElementId;
        });

      this.element.sliceName = this.editedSliceName;
      this.element.id = newId;
      this.editingSliceName = false;
    } else if(commit !== undefined && !commit) {
      this.editingSliceName = false;
    } else {
      this.editingSliceName = true;
      this.editedSliceName = this.element.sliceName;
    }
  }

  public getTypeDisplay(type: IElementDefinitionType) {
    return ElementTreeModel.getTypeRefDisplay([type]);
  }

  public getTypes() {
    const types = <IElementDefinitionType[]> this.elementTreeModel.baseElement.type;
    const baseTypes = types || [];

    const elementTreeModelTypes = <IElementDefinitionType[]> (this.element.type || []);

    const filtered = baseTypes.filter((baseType: IElementDefinitionType) => {
      const typeAlreadySelected = elementTreeModelTypes.find((type: TypeRefComponent) => type.code === baseType.code);
      return !typeAlreadySelected;        // Only return definedTypeCodes that are no found in the list of types in the element
    });

    return filtered;
  }

  public getDefaultType(): string {
    const types = this.getTypes();

    if (types.length > 0) {
      return types[0].code;
    }

    return '';
  }

  toggleAlias() {
    if(!this.element){
      return;
    }
    if(this.element.hasOwnProperty('alias')){
      delete this.element.alias;
    }else{
      this.element.alias = [];
      this.element.alias.push('');
    }
  }

  async addType() {
    const elementTypes = <(TypeRefComponent | ElementDefinitionTypeRefComponent)[]> this.element.type;
    elementTypes.push({code: this.getDefaultType()});

    await this.typeChanged();
  }

  isPrimitiveExceptBoolean() {
    const type = this.elementTreeModel.baseElement.type;
    return !type || type.length === 0 || !type[0].code ||
      (this.fhirService.primitiveTypes.indexOf(type[0].code) !== -1 && type[0].code !== 'boolean');
  }

  get isMinValid() {
    if (!this.element || typeof this.element.min === 'undefined') {
      return true;
    }

    const maxRequired = this.element.max || this.elementTreeModel.baseElement.max;
    const minValue = this.element.min;

    if (!this.elementTreeModel.isSlice && minValue < this.elementTreeModel.baseElement.min) {
      return false;
    }

    // If max is specified, and max is not "unlimited", make sure min less than max
    if (maxRequired !== undefined && maxRequired !== '*' && minValue > parseInt(maxRequired)) {
      return false;
    }

    return true;
  }

  get isMaxValid(){
    if (!this.element || typeof this.element.min === 'undefined') {
      return true;
    }

    const maxValue = this.element.max;
    const minRequired = this.element.min || this.elementTreeModel.baseElement.min;

    if (!this.elementTreeModel.isSlice && maxValue !== undefined &&
      ((maxValue !== "*" && this.elementTreeModel.baseElement.max !== "*" && maxValue > this.elementTreeModel.baseElement.max)
      || (maxValue === "*" && this.elementTreeModel.baseElement.max !== "*"))) {
      return false;
    }

    // If max is specified, min is specified, and max is not "unlimited", make sure max greater than min
    if(maxValue !== undefined && maxValue !== "*" && minRequired !== undefined && parseInt(maxValue) < minRequired){
      return false;
    }

    return true;
  }

  private refreshExamples() {
    let elementTypes = this.elementTreeModel.constrainedElement ?
      <(TypeRefComponent | ElementDefinitionTypeRefComponent)[]> this.elementTreeModel.constrainedElement.type : [];

    const elementExamples = <(ExampleComponent | ElementDefinitionExampleComponent)[]> this.element.example;

    if (!elementTypes || elementTypes.length === 0) {
      elementTypes = <(TypeRefComponent | ElementDefinitionTypeRefComponent)[]> this.elementTreeModel.baseElement.type;
    }

    for (const type of elementTypes) {
      if (!type.code) {
        continue;
      }

      const propertyName = 'value' + type.code.substring(0, 1).toUpperCase() + type.code.substring(1);
      const foundExample = elementExamples.find((example) => example.hasOwnProperty(propertyName));
      let rawValue;

      if (foundExample) {
        continue;
      }

      if (type.code === 'boolean') {
        rawValue = true;
      } else if (['instant', 'decimal', 'integer', 'unsignedInt', 'positiveInt'].indexOf(type.code) >= 0) {
        rawValue = 1;
      } else if (this.fhirService.primitiveTypes.indexOf(type.code) >= 0) {
        rawValue = '';
      } else {
        rawValue = {};
      }

      const newExample = {
        label: `Example for ${type.code}`
      };

      newExample[propertyName] = rawValue;
      this.element.example.push(newExample);
    }

    // Remove any examples that aren't valid for the element anymore
    for (let i = this.element.example.length - 1; i >= 0; i--) {
      const example = this.element.example[i];
      const propertyKeys = Object.keys(example);
      const valuePropertyName = propertyKeys.find((pn) => pn.startsWith('value'));

      // Example doesn't have a value
      if (!valuePropertyName) {
        continue;
      }

      const typeName = valuePropertyName.substring('value'.length);
      const foundType = elementTypes.find((t) => t.code && t.code.toLowerCase() === typeName.toLowerCase());

      // The type no longer exists on the element, remove the example for it
      if (!foundType) {
        this.element.example.splice(i, 1);
      }
    }
  }

  getExampleValueType(example) {
    const propertyKeys = Object.keys(example);
    const valuePropertyName = propertyKeys.find((pn) => pn.startsWith('value'));
    const type = valuePropertyName.substring('value'.length);

    if (['Instant', 'Time', 'Date', 'DateTime', 'Base64Binary', 'Decimal', 'Code', 'String', 'Integer', 'Uri', 'Boolean', 'Url', 'Markdown', 'Id', 'Oid', 'Uuid', 'UnsignedInt', 'PositiveInt'].indexOf(type) >= 0) {
      return type.substring(0, 1).toLowerCase() + type.substring(1);
    }

    return type;
  }

  toggleExample() {
    if (this.element.example) {
      delete this.element.example;
    } else {
      this.element.example = [];
      this.refreshExamples();
    }
  }

  getAllowedType(propertyPrefix: 'fixed'|'pattern'|'minValue'|'maxValue') {
    const dataTypes = this.fhirService.dataTypes;
    return dataTypes.find((dt) => {
      const caseSensitiveDataType = dt.substring(0, 1).toUpperCase() + dt.substring(1);
      return this.elementTreeModel.baseElement.hasOwnProperty(propertyPrefix + caseSensitiveDataType);
    });
  }

  ngOnInit() {
    this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
  }
}
