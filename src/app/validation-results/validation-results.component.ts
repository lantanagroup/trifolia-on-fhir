import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-validation-results',
  templateUrl: './validation-results.component.html',
  styleUrls: ['./validation-results.component.css']
})
export class ValidationResultsComponent implements OnInit {
  @Input() results: any;

  constructor() { }

  ngOnInit() {
  }

}
