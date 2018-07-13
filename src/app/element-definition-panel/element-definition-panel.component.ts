import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ElementDefinitionTypeModalComponent} from '../fhir-edit/element-definition-type-modal/element-definition-type-modal.component';
import {Globals} from '../globals';
import {ElementTreeModel} from '../models/element-tree-model';
import {ElementDefinition, StructureDefinition} from '../models/fhir';

@Component({
  selector: 'app-element-definition-panel',
  templateUrl: './element-definition-panel.component.html',
  styleUrls: ['./element-definition-panel.component.css']
})
export class ElementDefinitionPanelComponent implements OnInit {
  @Input() elementTreeModel: ElementTreeModel;
  @Input() elements: ElementTreeModel[];
  @Input() structureDefinition: StructureDefinition;
  @Input() disabled = false;

  public editingSliceName: boolean;
  public editedSliceName: string;
  public valueSetChoices = ['Uri', 'Reference'];

  constructor(private modalService: NgbModal, public globals: Globals) {

  }

  get element(): ElementDefinition {
      return this.elementTreeModel.constrainedElement;
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
      const modalRef = this.modalService.open(ElementDefinitionTypeModalComponent);
      modalRef.componentInstance.element = element;
      modalRef.componentInstance.type = type;
  }

  toggleEditSliceName() {
      if (this.editingSliceName) {
          this.element.sliceName = this.editedSliceName;
          this.elementTreeModel.setId(this.editedSliceName);
          this.editingSliceName = false;
      } else {
          this.editingSliceName = true;
          this.editedSliceName = this.element.sliceName;
      }
  }

  setValueSetChoice(elementBinding: any, choice: string) {
      const foundChoice = this.globals.getChoiceProperty(elementBinding, 'valueSet', ['Uri', 'Reference']);

      if (foundChoice !== choice) {
          delete elementBinding['valueSet' + foundChoice];
      }

      switch (choice) {
          case 'Uri':
              elementBinding['valueSetUri'] = '';
              break;
          case 'Reference':
              elementBinding['valueSetReference'] = {
                  reference: '',
                  display: ''
              };
              break;
      }
  }

  ngOnInit() {
  }
}
