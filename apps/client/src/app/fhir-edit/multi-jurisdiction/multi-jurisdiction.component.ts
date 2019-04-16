import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {FhirService} from '../../shared/fhir.service';

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

  public tooltip: string;
  public Globals = Globals;

  constructor(
    private fhirService: FhirService) {
  }

  ngOnInit() {
    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    } else if (this.tooltipPath) {
      this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
    }
  }
}
