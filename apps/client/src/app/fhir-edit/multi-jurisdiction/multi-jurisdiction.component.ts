import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {FhirService} from '../../shared/fhir.service';
import {ICodeableConcept, ICoding} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {Coding} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';

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
  public editFields: boolean[][] = [[]];
  public jurisdictionCodes: Coding[];

  constructor(
    private fhirService: FhirService) {
  }

  get jurisdictions(): ICodeableConcept[] {
    if (this.parentObject.hasOwnProperty(this.propertyName)) {
      return <ICodeableConcept[]> this.parentObject[this.propertyName];
    }
    return null;
  }

  addJurisdiction() {
    if (!this.jurisdictions) {
      this.parentObject[this.propertyName] = [];
      this.editFields = [[]];
    }

    this.jurisdictions.push({ });
    this.addCoding(this.jurisdictions[this.jurisdictions.length - 1], this.jurisdictions.length - 1);
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

  addCoding(jurisdiction: ICodeableConcept, index: number) {
    jurisdiction.coding = jurisdiction.coding || [];
    jurisdiction.coding.push({});
    if(this.editFields.length < index + 1){
      this.editFields.push([]);
    }
    this.editFields[index].push(false);
  }

  isInvalid(){
    return this.required && (this.jurisdictions && this.checkForCompletedJurisdiction());
  }

  checkForCompletedJurisdiction(){
    for(let x = 0; x < this.jurisdictions.length; x++){
      if(this.jurisdictions[x].text && this.jurisdictions[x].coding){
        for(let y = 0; y < this.jurisdictions[x].coding.length; y++){
          if(this.jurisdictions[x].text && this.jurisdictions[x].coding[y].code && this.jurisdictions[x].coding[y].display
            && this.jurisdictions[x].coding[y].system){
            return false;
          }
        }
      }
    }
    return true;
  }

  removeJurisdiction(index: number){
    this.jurisdictions.splice(index, 1);
    this.editFields.splice(index, 1);
    if(this.jurisdictions.length === 0){
      delete this.parentObject[this.propertyName];
      this.editFields = [[]];
    }
  }

  ngOnInit() {
    if(!this.jurisdictionCodes){
      this.jurisdictionCodes = this.fhirService.getValueSetCodes("http://hl7.org/fhir/ValueSet/iso3166-1-2");
    }

    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    } else if (this.tooltipPath) {
      this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
    }
  }

  getJurisdictionCode(coding: ICoding) {
    if (!this.jurisdictionCodes) return null;
    return this.jurisdictionCodes.find(j => j.code === coding.code && j.display === coding.display && j.system === coding.system);
  }

  setJurisdictionCode(jurisdiction: ICodeableConcept, index: number, coding: ICoding) {
    if (!jurisdiction.text) {
      jurisdiction.text = coding.display;
    }

    jurisdiction.coding[index] = {
      code: coding.code,
      display: coding.display,
      system: coding.system
    };
  }
}
