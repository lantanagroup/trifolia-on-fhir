import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-fhir-max-cardinality',
  templateUrl: './max-cardinality.component.html',
  styleUrls: ['./max-cardinality.component.css']
})
export class MaxCardinalityComponent implements OnInit {
  @Input() parentObject: any;
  @Input() property: string;

  constructor() { }

  public get cardinalityNumber(): number {
    const floatVal = parseFloat(this.parentObject[this.property]);

    if (!isNaN(floatVal)) {
      return floatVal;
    } else {
      return undefined;
    }
  }

  public set cardinalityNumber(value: number) {
    this.parentObject[this.property] = value.toString();
  }

  public toggleUnlimited(value: boolean) {
    if (value) {
      this.parentObject[this.property] = '*';
    } else {
      this.parentObject[this.property] = '1';
    }
  }

  ngOnInit() {
  }

}
