import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StructureDefinition, StructureDefinitionContextComponent} from '../../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {IContextPanelComponent} from '../context-panel-wrapper.component';
import {Globals} from '../../../../../../../libs/tof-lib/src/lib/globals';

@Component({
  selector: 'app-structure-definition-context-panel-r4',
  templateUrl: './context-panel-r4.component.html',
  styleUrls: ['./context-panel-r4.component.css']
})
export class ContextPanelR4Component implements OnInit, IContextPanelComponent {
  @Input() public structureDefinition: StructureDefinition;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  public Globals = Globals;

  constructor() {
  }

  ngOnInit() {
  }

  addContext(){
    this.structureDefinition.context.push(new StructureDefinitionContextComponent);
  }

}
