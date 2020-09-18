import {Component, Input, OnInit} from '@angular/core';
import {ImplementationGuide} from '../../../../../../../libs/tof-lib/src/lib/stu3/fhir';

@Component({
  selector: 'trifolia-fhir-stu3-page',
  templateUrl: './stu3-page.component.html',
  styleUrls: ['./stu3-page.component.css']
})
export class STU3PageComponent implements OnInit {
  @Input() implementationGuide: ImplementationGuide;

  constructor() { }

  ngOnInit() {
  }

}
