import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NgbModal, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {STU3TypeModalComponent} from './stu3-type-modal/type-modal.component';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {ElementTreeModel} from '../../models/element-tree-model';
import {
  Coding,
  ElementDefinition,
  StructureDefinition,
  TypeRefComponent
} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
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

  @ViewChild('edTabSet') edTabSet: NgbTabset;
  @ViewChild('idTextField') idTextField: ElementRef;

  constructor(
    private modalService: NgbModal,
    private fhirService: FhirService,
    private renderer: Renderer2,
    public configService: ConfigService) {

  }

  get element(): ElementDefinition {
    if (this.elementTreeModel) {
      return this.elementTreeModel.constrainedElement;
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

  editMappings() {
    const modalRef = this.modalService.open(MappingModalComponent, {size: 'lg'});
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
    } else {
      this.editingSliceName = true;
      this.editedSliceName = this.element.sliceName;
    }
  }

  private getTypes(): Coding[] {
    const baseTypes = this.elementTreeModel.baseElement.type || [];
    const elementTreeModelTypes = this.element.type || [];

    const filtered = baseTypes.filter((baseType: TypeRefComponent) => {
      const typeAlreadySelected = elementTreeModelTypes.find((type: TypeRefComponent) => type.code === baseType.code);
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
