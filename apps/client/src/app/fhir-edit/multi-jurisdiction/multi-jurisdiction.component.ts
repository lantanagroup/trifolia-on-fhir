import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {FhirService} from '../../shared/fhir.service';
import {ICodeableConcept} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Component({
  selector: 'app-fhir-multi-jurisdiction',
  templateUrl: './multi-jurisdiction.component.html',
  styleUrls: ['./multi-jurisdiction.component.css']
})
export class FhirMultiJurisdictionComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() tooltipPath: string;
  @Input() tooltipKey: string;
  @Input() required: boolean;

  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  public tooltip: string;
  public Globals = Globals;

  constructor(
    private fhirService: FhirService) {
  }

  get jurisdictions(): ICodeableConcept[] {
    if (this.parentObject[this.propertyName]) {
      return <ICodeableConcept[]> this.parentObject[this.propertyName];
    }
  }

  addJurisdiction() {
    if (!this.jurisdictions) {
      this.parentObject[this.propertyName] = [];
    }

    this.jurisdictions.push({ });
  }

  getText(jurisdiction: ICodeableConcept) {
    return jurisdiction.text;
  }

  setText(jurisdiction: ICodeableConcept, value: string) {
    if (value) {
      jurisdiction.text = value;
    } else {
      delete jurisdiction.text;
    }
  }

  addCoding(jurisdiction: ICodeableConcept) {
    jurisdiction.coding = jurisdiction.coding || [];
    jurisdiction.coding.push({});
  }

  isInvalid(){
    return this.required && (!this.jurisdictions[0].text ||
      (this.jurisdictions[0].coding && (!this.jurisdictions[0].coding[0].code || !this.jurisdictions[0].coding[0].display || !this.jurisdictions[0].coding[0].system)));
  }

  removeJurisdiction(index: number){
    this.jurisdictions.splice(index, 1);
    if(this.jurisdictions.length === 0){
      this.parentObject[this.propertyName] = undefined;
    }
  }

  ngOnInit() {
    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    } else if (this.tooltipPath) {
      this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
    }
  }
}
