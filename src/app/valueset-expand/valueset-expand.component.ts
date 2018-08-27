import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ValueSetService} from '../services/value-set.service';
import {OperationOutcome, ValueSet} from '../models/stu3/fhir';
import {Globals} from '../globals';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';

interface ValueSetExpandCriteria {
    filter?: string;
    profile?: string;
    date?: string;
    offset?: number;
    count?: number;
    includeDesignations?: boolean;
    includeDefinition?: boolean;
    activeOnly?: boolean;
    excludeNested?: boolean;
    excludeNotForUI?: boolean;
    excludePostCoordinated?: boolean;
    displayLanguage?: string;
    limitedExpansion?: boolean;
}

@Component({
  selector: 'app-valueset-expand',
  templateUrl: './valueset-expand.component.html',
  styleUrls: ['./valueset-expand.component.css']
})
export class ValuesetExpandComponent implements OnInit {
  public valueSet: ValueSet;
  public results: ValueSet|OperationOutcome;
  public criteria: ValueSetExpandCriteria = {};

  constructor(
      private route: ActivatedRoute,
      private valueSetService: ValueSetService,
      public globals: Globals) {
  }

  public expand(tabSet: NgbTabset) {
      const valueSetId = this.route.snapshot.paramMap.get('id');
      this.valueSetService.expand(valueSetId)
          .subscribe((results) => {
              this.results = results;
              setTimeout(() => {
                  tabSet.select('results');
              });
          }, (err) => {
              this.results = {
                  resourceType: 'OperationOutcome',
                  text: {
                      status: 'generated',
                      div: 'An error occurred while expanding the value set: ' + err
                  },
                  issue: []
              };
              setTimeout(() => {
                  tabSet.select('results');
              });
          });
  }

  ngOnInit() {
    const valueSetId = this.route.snapshot.paramMap.get('id');
    this.valueSetService.get(valueSetId)
        .subscribe((valueSet) => {
          this.valueSet = valueSet;
        }, (err) => {
          // TODO
        });
  }
}
