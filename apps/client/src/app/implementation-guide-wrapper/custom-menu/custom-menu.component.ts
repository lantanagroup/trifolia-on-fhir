import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {debounceTime} from 'rxjs/operators';
import {getCustomMenu, getIgnoreWarningsValue, setCustomMenu, setIgnoreWarningsValue} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {ConfigService} from '../../shared/config.service';
import {ImplementationGuide as STU3ImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {IgPageHelper} from '../../../../../../libs/tof-lib/src/lib/ig-page-helper';
import {ImplementationGuide as R4ImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {PageInfo} from '../../../../../../libs/tof-lib/src/lib/ig-page-helper';

@Component({
  selector: 'trifolia-fhir-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.css']
})
export class CustomMenuComponent implements OnInit, OnChanges {
  @Input() implementationGuide: IImplementationGuide;
  @Input() readOnly = false;
  @Output() change = new EventEmitter<string>();
  public valueChanged = new EventEmitter();
  public value: string;

  constructor(private configService: ConfigService) {
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

  generate() {
    let pageInfos: PageInfo[];

    if (this.configService.isFhirSTU3) {
      const stu3ImplementationGuide = <STU3ImplementationGuide> this.implementationGuide;
      pageInfos = IgPageHelper.getSTU3PagesList([], stu3ImplementationGuide.page, stu3ImplementationGuide);
    } else if (this.configService.isFhirR4) {
      const r4ImplementationGuide = <R4ImplementationGuide> this.implementationGuide;
      if (r4ImplementationGuide.definition) {
        pageInfos = IgPageHelper.getR4PagesList([], r4ImplementationGuide.definition.page, r4ImplementationGuide);
      }
    }

    this.customMenuValue = IgPageHelper.getMenuContent(pageInfos);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.value = getCustomMenu(this.implementationGuide);
  }

  ngOnInit() {
    this.value = getCustomMenu(this.implementationGuide);
  }
}
