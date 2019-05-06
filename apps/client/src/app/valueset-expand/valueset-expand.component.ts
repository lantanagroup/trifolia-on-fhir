import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ValueSetService} from '../shared/value-set.service';
import {OperationOutcome, ValueSet} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../shared/fhir.service';
import {ExpandOptions} from '../../../../../libs/tof-lib/src/lib/stu3/expandOptions';

@Component({
  templateUrl: './valueset-expand.component.html',
  styleUrls: ['./valueset-expand.component.css']
})
export class ValuesetExpandComponent implements OnInit {
  public valueSet: ValueSet;
  public results: ValueSet | OperationOutcome;
  public criteria: ExpandOptions = {};
  public message: string;
  public expanding = false;
  public terminologyServer: string;

  constructor(
    private route: ActivatedRoute,
    private valueSetService: ValueSetService,
    private fhirService: FhirService) {
  }

  public get hasError(): boolean {
    return !this.results || this.results.resourceType !== 'ValueSet';
  }

  public get isOperationOutcome(): boolean {
    return this.results && this.results.resourceType === 'OperationOutcome';
  }

  public expand(tabSet: NgbTabset) {
    this.expanding = true;
    this.message = 'Expanding... This may take a while.';

    const valueSetId = this.route.snapshot.paramMap.get('id');
    this.valueSetService.expand(valueSetId, this.criteria, this.terminologyServer)
      .subscribe((results) => {
        this.results = results;
        setTimeout(() => {
          this.expanding = false;
          this.message = 'Expansion complete';
          tabSet.select('results');
        });
      }, (err) => {
        this.results = {
          resourceType: 'OperationOutcome',
          text: {
            status: 'generated',
            div: 'An error occurred while expanding the value set: ' + this.fhirService.getErrorString(err)
          },
          issue: []
        };
        setTimeout(() => {
          this.expanding = false;
          this.message = 'Expansion completed with errors';
          tabSet.select('results');
        });
      });
  }

  ngOnInit() {
    const valueSetId = this.route.snapshot.paramMap.get('id');
    this.valueSetService.get(valueSetId)
      .subscribe((valueSet) => {
        if (valueSet.resourceType !== 'ValueSet') {
          throw new Error('The specified value set either does not exist or was deleted');
        }

        this.valueSet = <ValueSet>valueSet;
      }, (err) => {
        this.message = 'An error occurred while loading the value set: ' + this.fhirService.getErrorString(err);
      });
  }
}
