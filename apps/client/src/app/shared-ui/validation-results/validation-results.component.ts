import {Component, Input, OnInit} from '@angular/core';
import {ValidatorResponse} from 'fhir/validator';

@Component({
  selector: 'app-validation-results',
  templateUrl: './validation-results.component.html',
  styleUrls: ['./validation-results.component.css']
})
export class ValidationResultsComponent implements OnInit {
  @Input() results: ValidatorResponse;

  constructor() { }

  ngOnInit() {
  }

}
