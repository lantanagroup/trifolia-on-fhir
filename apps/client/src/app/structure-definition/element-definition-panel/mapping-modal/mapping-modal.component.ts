import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ElementDefinitionMappingComponent, MappingComponent,
  StructureDefinition as STU3StructureDefinition
} from '../../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  StructureDefinition as R4StructureDefinition,
  StructureDefinitionMappingComponent
} from '../../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../../../libs/tof-lib/src/lib/globals';

@Component({
  selector: 'app-mapping-modal',
  templateUrl: './mapping-modal.component.html',
  styleUrls: ['./mapping-modal.component.css']
})
export class MappingModalComponent implements OnInit {
  @Input() mappings: ElementDefinitionMappingComponent[];
  @Input() structureDefinition: STU3StructureDefinition | R4StructureDefinition;
  public Globals = Globals;

  constructor(
    public activeModal: NgbActiveModal) {
  }

  public get profileMappingIdentities(): string[] {
    if (!this.structureDefinition) {
      return [];
    }

    return (<any>(this.structureDefinition.mapping || [])).map((m) => m.identity);
  }

  ngOnInit() {

  }
}
