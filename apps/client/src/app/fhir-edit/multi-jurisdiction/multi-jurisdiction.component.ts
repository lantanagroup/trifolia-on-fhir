import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';
import { FhirService } from '../../shared/fhir.service';
import { ICodeableConcept, ICoding } from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { Coding } from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

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
  public jurisdictionCodes: Coding[];
  public editor: boolean[];

  constructor(
    private fhirService: FhirService) {
  }

  get jurisdictions(): ICodeableConcept[] {
    if (this.parentObject.hasOwnProperty(this.propertyName)) {
      return <ICodeableConcept[]>this.parentObject[this.propertyName];
    }
    return null;
  }

  public fillEditor(): boolean[] {
    const arr: boolean[] = [];
    if (this.jurisdictions) {
      for (let i = 0; i < this.jurisdictions.length; i++) {
        if (this.jurisdictions[i]) {
          arr[i] = true;
        }
      }
    }
    return arr;
  }

  public changeEditor(index: number) {
    this.editor[index] = !this.editor[index];
  }

  addJurisdiction() {
    if (!this.jurisdictions) {
      this.parentObject[this.propertyName] = [];
    }

    this.jurisdictions.push({});
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
    if (jurisdiction.coding.length === 1) {
      this.setJurisdictionCode(this.jurisdictions[index], 0, this.jurisdictionCodes[0]);
    }
  }

  isInvalid(){
    return this.required && (this.jurisdictions && this.checkForCompletedJurisdiction());
  }

  checkForCompletedJurisdiction(){
    for(let x = 0; x < this.jurisdictions.length; x++){
      if (!this.jurisdictions[x].coding) {
        continue;
      }
      for(let y = 0; y < this.jurisdictions[x].coding.length; y++){
        if(this.jurisdictions[x].text && this.jurisdictions[x].coding[y].code && this.jurisdictions[x].coding[y].display
          && this.jurisdictions[x].coding[y]?.system){
          return false;
        }
      }
    }
    return true;
  }

  removeJurisdiction(index: number) {
    this.jurisdictions.splice(index, 1);
    if (this.jurisdictions.length === 0) {
      delete this.parentObject[this.propertyName];
    }
  }

  public typeaheadFormatter = (result: Coding) => {
    return result.code;
  };

  public typeaheadSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term: string) => term.length < 1 ? [] : this.jurisdictionCodes.filter((coding) => {
      if (coding.code && coding.code.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
        return coding.code;
      }
    })));

  ngOnInit() {
    if (!this.jurisdictionCodes) {
      this.jurisdictionCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/iso3166-1-2');
      this.jurisdictionCodes.sort(function(a, b) {
        if (a.display < b.display) return -1;
        if (a.display > b.display) return 1;
        return 0;
      });
      const us = this.jurisdictionCodes.find(jc =>
        jc.display === 'United States of America');
      const index = this.jurisdictionCodes.indexOf(us);
      this.jurisdictionCodes.splice(index, 1);

      const u = <ICoding>{
        system: 'http://unstats.un.org/unsd/methods/m49/m49.htm',
        code: '001',
        version: '2.2.0',
        display: 'Universal'
      };
      const universal = <ICodeableConcept>{
        coding: u
      };

      this.setJurisdictionCode(universal, 0, u);
      this.jurisdictionCodes.push(u);

      const uv = this.jurisdictionCodes.find(jc =>
        jc.display === 'Universal');
      const indexOfUniversal = this.jurisdictionCodes.indexOf(uv);
      this.jurisdictionCodes.splice(indexOfUniversal, 1);
      this.jurisdictionCodes.splice(0, 0, u, us);

      this.editor = this.fillEditor();
    }

    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    } else if (this.tooltipPath) {
      this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
    }
  }

  getJurisdictionCodes(input: string) {
    if (!this.jurisdictionCodes) return null;
    return this.jurisdictionCodes.find(j => j && j.code === input).code;
  }

  setJurisdictionCode(jurisdiction: ICodeableConcept, index: number, coding: ICoding) {
    jurisdiction.text = coding.display;
    jurisdiction.coding[index] = {
      code: coding.code,
      display: coding.display,
      system: coding.system
    };
  }
}
