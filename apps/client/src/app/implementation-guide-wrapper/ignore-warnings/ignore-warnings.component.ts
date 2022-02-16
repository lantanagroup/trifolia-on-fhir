import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IImplementationGuide } from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { getIgnoreWarningsValue, setIgnoreWarningsValue } from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'trifolia-fhir-ignore-warnings',
  templateUrl: './ignore-warnings.component.html',
  styleUrls: ['./ignore-warnings.component.css']
})
export class IgnoreWarningsComponent implements OnInit, OnChanges {
  @Input() implementationGuide: IImplementationGuide;
  @Output() change = new EventEmitter<string>();
  public valueChanged = new Subject();
  public value: string;

  constructor() {
    this.valueChanged
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.updateIgnoreWarningsValue();
        this.change.emit(this.value);
      });
  }

  get intervalValue() {
    return this.value;
  }

  set intervalValue(value: string) {
    this.value = value;
    this.valueChanged.next(this.value);
  }

  public updateIgnoreWarningsValue() {
    setIgnoreWarningsValue(this.implementationGuide, this.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.value = getIgnoreWarningsValue(this.implementationGuide);
  }

  ngOnInit() {
    this.value = getIgnoreWarningsValue(this.implementationGuide);
  }
}
