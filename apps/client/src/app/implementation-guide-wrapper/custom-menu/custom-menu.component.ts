import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {debounceTime} from 'rxjs/operators';
import {getCustomMenu, getIgnoreWarningsValue, setCustomMenu, setIgnoreWarningsValue} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';

@Component({
  selector: 'trifolia-fhir-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.css']
})
export class CustomMenuComponent implements OnInit, OnChanges {
  @Input() implementationGuide: IImplementationGuide;
  @Output() change = new EventEmitter<string>();
  public valueChanged = new EventEmitter();
  public value: string;

  constructor() {
    this.valueChanged
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.updateCustomMenu();
        this.change.emit(this.value);
      });
  }

  get customMenuValue() {
    return this.value;
  }

  set customMenuValue(value: string) {
    this.value = value;
    this.valueChanged.emit();
  }

  public updateCustomMenu() {
    setCustomMenu(this.implementationGuide, this.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.value = getCustomMenu(this.implementationGuide);
  }

  ngOnInit() {
    this.value = getCustomMenu(this.implementationGuide);
  }
}
