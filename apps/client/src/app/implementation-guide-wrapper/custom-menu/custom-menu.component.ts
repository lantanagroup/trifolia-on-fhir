import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { ConfigService } from '../../shared/config.service';
/*import { IgPageHelper, PageInfo } from '../../../../../../libs/tof-lib/src/lib/ig-page-helper';*/
import {firstValueFrom, Subject} from 'rxjs';
import {IFhirResource, INonFhirResource, IProjectResourceReference, NonFhirResource, Page} from '@trifolia-fhir/models';
import {FhirResourceService} from '../../shared/fhir-resource.service';
import {IgPageHelper} from '@trifolia-fhir/tof-lib';

@Component({
  selector: 'trifolia-fhir-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.css']
})
export class CustomMenuComponent implements OnInit, OnChanges {
  @Input() resource: any;
  @Input() customMenu: any;
  @Output() change = new EventEmitter<string>();
  public valueChanged = new Subject();
  public value: string;


  constructor(private configService: ConfigService, private fhirResourceService: FhirResourceService) {

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
    this.customMenu["content"] = this.value;
  }

  async generate() {

    let fhirResource: IFhirResource  = await firstValueFrom(this.fhirResourceService.getWithReferences(this.resource.id));

    let pages = [];

    fhirResource.references.forEach((ref: IProjectResourceReference) => {
      if (ref.valueType == NonFhirResource.name && typeof  ref.value == typeof {} &&  (<INonFhirResource>ref.value).type === Page.name){
        let page = ref.value as Page;
        pages.push(page);
      }
    });

    this.customMenuValue = IgPageHelper.getMenuContent(pages);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.value = this.customMenu["content"];
  }

  ngOnInit() {
    this.value = this.customMenu["content"];
  }
}
