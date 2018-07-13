import { Component, OnInit } from '@angular/core';
import {OperationDefinitionService} from '../services/operation-definition.service';
import {OperationDefinition} from '../models/fhir';
import * as _ from 'underscore';

@Component({
  selector: 'app-operation-definitions',
  templateUrl: './operation-definitions.component.html',
  styleUrls: ['./operation-definitions.component.css']
})
export class OperationDefinitionsComponent implements OnInit {
  public operationDefinitions: OperationDefinition[] = [];

  constructor(
      private opDefService: OperationDefinitionService) {

  }

  ngOnInit() {
      this.opDefService.search()
          .subscribe((results) => {
              this.operationDefinitions = _.map(results.entry, (entry) => <OperationDefinition> entry.resource);
          });
  }

}
