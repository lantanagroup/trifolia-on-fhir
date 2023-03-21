import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IImplementationGuide } from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { debounceTime } from 'rxjs/operators';
import { getCustomMenu, setCustomMenu } from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import { ConfigService } from '../../shared/config.service';
import { ImplementationGuide as STU3ImplementationGuide } from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { IgPageHelper, PageInfo } from '../../../../../../libs/tof-lib/src/lib/ig-page-helper';
import { ImplementationGuide as R4ImplementationGuide } from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import { ImplementationGuide as R5ImplementationGuide } from '../../../../../../libs/tof-lib/src/lib/r5/fhir';
import { Subject } from 'rxjs';

@Component({
  selector: 'trifolia-fhir-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.css']
})
export class CustomMenuComponent implements OnInit, OnChanges {
  @Input() implementationGuide: IImplementationGuide;
  @Output() change = new EventEmitter<string>();
  public valueChanged = new Subject();
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
    this.valueChanged.next(this.value);
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
        pageInfos = IgPageHelper.getR4andR5PagesList([], r4ImplementationGuide.definition.page, r4ImplementationGuide);
      }
    } else if (this.configService.isFhirR5) {
      const r5ImplementationGuide = <R5ImplementationGuide> this.implementationGuide;
      if (r5ImplementationGuide.definition) {
        pageInfos = IgPageHelper.getR4andR5PagesList([], r5ImplementationGuide.definition.page, r5ImplementationGuide);
      }
    } else {
      throw new Error(`Unexpected FHIR version: ${this.configService.fhirConformanceVersion}`);
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
