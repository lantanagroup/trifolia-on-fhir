import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';

@Component({
  selector: 'app-fhir-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.css']
})
export class FhirQuantityComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() required = false;
  @Input() isFormGroup = true;
  @Input() defaultValue = {};
  @Input() tooltip: string;
  @Input() tooltipKey: string;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  public Globals = Globals;

  constructor() {

  }

  ngOnInit() {
    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    }
  }
}
