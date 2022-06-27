import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { Coding, ImplementationGuide } from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import { FhirService } from '../shared/fhir.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'trifolia-fhir-search-parameter',
  templateUrl: './search-parameter.component.html',
  styleUrls: ['./search-parameter.component.css']
})
export class SearchParameterComponent implements OnInit {
  @Input() public implementationGuide: ImplementationGuide;
  public results: [] = null;
  public resourceTypeCodes: Coding[] = [];
  public name: string;
  public xml: string;

  constructor(
    public configService: ConfigService,
    public route: ActivatedRoute,
    private fhirService: FhirService
  ) {
  }

  public getSearchParameters() {
    this.results = null;
    this.configService.setStatusMessage('Loading search parameters');

  }

  ngOnInit() {
    this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.getSearchParameters();

    // Watch the route parameters to see if the id of the implementation guide changes. Reload if it does.
    this.route.params.subscribe((params) => {
      if (params.implementationGuideId && this.implementationGuide && params.implementationGuideId !== this.implementationGuide.id) {
        this.getSearchParameters();
      }
    });
  }

}
