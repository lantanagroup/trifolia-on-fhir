import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ElementTreeModel} from '../../models/element-tree-model';
import {Coding, StructureDefinition, TypeRefComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirService} from '../../shared/fhir.service';
import { ElementDefinitionTypeRefComponent } from '../../../../../../libs/tof-lib/src/lib/r4/fhir';

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
  @Input() element = new ElementTreeModel();
  @Input() structureDefinition = new StructureDefinition();
  public selectedType: string;
  public types: TypeRefComponent[] | ElementDefinitionTypeRefComponent[];
  public definedTypeCodes: Coding[] = [];

  constructor(
    private fhirService: FhirService,
    public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
    if (this.element.constrainedElement && this.element.constrainedElement.type) {
      this.types =  this.element.constrainedElement.type;
    } else {
      this.types = this.definedTypeCodes.map((definedTypeCode: Coding) =>
        new TypeRefComponent({code: definedTypeCode.code}));
    }
  }
}
