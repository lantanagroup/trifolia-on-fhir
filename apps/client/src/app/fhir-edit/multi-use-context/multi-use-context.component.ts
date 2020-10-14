import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {Coding, UsageContext} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirService} from '../../shared/fhir.service';

@Component({
  selector: 'app-fhir-multi-use-context',
  templateUrl: './multi-use-context.component.html',
  styleUrls: ['./multi-use-context.component.css']
})
export class FhirMultiUseContextComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() tooltipKey: string;
  @Input() tooltipPath: string;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  public tooltip: string;
  public usageContextTypeCodes: Coding[] = [];
  public Globals = Globals;

  constructor(
    private fhirService: FhirService) {
  }

  public getUseContextCodeType(useContext: UsageContext) {
    if (useContext.hasOwnProperty('valueCodeableConcept')) {
      return 'CodeableConcept';
    } else if (useContext.hasOwnProperty('valueQuantity')) {
      return 'Quantity';
    } else if (useContext.hasOwnProperty('valueRange')) {
      return 'Range';
    }
  }

  public setUseContextCodeType(useContext: UsageContext, type: string) {
    if (useContext.hasOwnProperty('value' + type)) {
      return;
    }

    delete useContext.valueCodeableConcept;
    delete useContext.valueQuantity;
    delete useContext.valueRange;

    switch (type) {
      case 'CodeableConcept':
        useContext.valueCodeableConcept = {
          coding: []
        };
        break;
      case 'Quantity':
        useContext.valueQuantity = {
          unit: '',
          value: null
        };
        break;
      case 'Range':
        useContext.valueRange = {
          low: {
            unit: '',
            value: null
          },
          high: {
            unit: '',
            value: null
          }
        };
        break;
    }
  }

  ngOnInit() {
    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    } else if (this.tooltipPath) {
      this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
    }

    this.usageContextTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/usage-context-type');
  }
}
