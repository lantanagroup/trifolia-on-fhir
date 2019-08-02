import {Component, Input, OnInit} from '@angular/core';
import {ConceptSetComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';

@Component({
  selector: 'app-valueset-include-panel',
  templateUrl: './include-panel.component.html',
  styleUrls: ['./include-panel.component.css']
})
export class IncludePanelComponent implements OnInit {
  @Input() include: ConceptSetComponent;

  public Globals = Globals;

  constructor() {
  }

  ngOnInit() {
  }
}
