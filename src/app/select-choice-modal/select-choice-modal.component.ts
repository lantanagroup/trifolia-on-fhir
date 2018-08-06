import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ElementTreeModel} from '../models/element-tree-model';
import {Coding, StructureDefinition, TypeRefComponent} from '../models/stu3/fhir';
import {Globals} from '../globals';
import * as _ from 'underscore';

/**
 * This component represents a modal window that can instantiated using NgbModal.
 * The modal window allows the user to select a specific type for the given
 * constrainedElement of a ElementTreeModel item.
 */
@Component({
  selector: 'app-select-choice-modal',
  templateUrl: './select-choice-modal.component.html',
  styleUrls: ['./select-choice-modal.component.css']
})
export class SelectChoiceModalComponent implements OnInit {
  @Input() element: ElementTreeModel;
  @Input() structureDefinition: StructureDefinition;
  public selectedType: string;
  public types: TypeRefComponent[];

  constructor(
      public globals: Globals,
      public activeModal: NgbActiveModal) { }

  ngOnInit() {
    if (this.element.constrainedElement && this.element.constrainedElement.type) {
      this.types = this.element.constrainedElement.type;
    } else {
      this.types = _.map(this.globals.definedTypeCodes, (definedTypeCode: Coding) =>
          new TypeRefComponent({ code: definedTypeCode.code }));
    }
  }
}
