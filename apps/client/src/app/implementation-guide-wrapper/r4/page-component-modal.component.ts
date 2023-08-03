import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {
  Binary,
  Extension,
  ImplementationGuide,
  ImplementationGuidePageComponent
} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {getImplementationGuideMediaReferences, MediaReference} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Observable} from 'rxjs';
import {debounceTime, distinct, distinctUntilChanged, map} from 'rxjs/operators';
import {NonFhirResource} from '../../../../../server/src/app/nonFhirResources/nonFhirResource.schema';
import {IFhirResource, INonFhirResource} from '@trifolia-fhir/models';
import {FhirDisplayPipe} from '../../shared-ui/fhir-display-pipe';
import {ResourceSelection} from '../../fhir-edit/reference-modal/reference-modal.component';
import {FhirResourceService} from '../../shared/fhir-resource.service';
import {NonFhirResourceService} from '../../shared/nonFhir-resource-.service';
import {getErrorString, getImplementationGuideContext} from '@trifolia-fhir/tof-lib';

@Component({
  templateUrl: './page-component-modal.component.html',
  styleUrls: ['./page-component-modal.component.css']
})
export class PageComponentModalComponent implements OnInit {
  public inputPage: ImplementationGuidePageComponent;
  public page: ImplementationGuidePageComponent;
  public implementationGuide: ImplementationGuide;
  public implementationGuideId: string;
  public level: number;
  public rootPage: boolean;
  public pageNavMenus: string[];
  public resource:  INonFhirResource;

  constructor(public activeModal: NgbActiveModal, protected nonFhirResourceService: NonFhirResourceService) {

  }

  public get isRootPageValid() {
    if (!this.rootPage) return true;
    return this.page.fileName === 'index' + this.page.getExtension();
  }

  public getMediaReferences(): MediaReference[] {
    return getImplementationGuideMediaReferences('r4', this.implementationGuide);
  }

  public setPage(value: ImplementationGuidePageComponent) {
    this.inputPage = value;
    this.page = new ImplementationGuidePageComponent(this.inputPage);
  }

  public setResource(value: INonFhirResource) {
    this.resource = value;
  }


  public get contentMarkdown() {
    return this.resource["content"];
  }


  public set contentMarkdown(value: string) {
    if(!this.resource){
     this.resource = <INonFhirResource>{};
    }
    this.resource["content"] = value;
    this.resource["type"] = 'page';
    this.resource["name"] = this.inputPage.nameUrl.substr(0,this.inputPage.nameUrl.indexOf("."));
    if (this.implementationGuide) {
      this.resource["referencedBy"] = [{'value': this.implementationGuideId, 'valueType': 'FhirResource'}];
    }

  }


 /* public get nameType(): 'Url'|'Reference' {
    if (this.page.hasOwnProperty('nameReference')) {
      return 'Reference';
    } else if (this.page.hasOwnProperty('nameUrl')) {
      return 'Url';
    }
  }

  public set nameType(value: 'Url'|'Reference') {
    if (this.nameType === value) {
      return;
    }

    if (this.nameType === 'Reference' && value === 'Url') {
      delete this.page.nameReference;
      this.page.nameUrl = '';
    } else if (this.nameType === 'Url' && value === 'Reference') {
      delete this.page.nameUrl;
      this.page.nameReference = { reference: '', display: '' };
    }
  }
*/
  pageNavMenuSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) => term.length < 2 ? [] : this.pageNavMenus.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),
      distinct()
    )

  public importFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const result = e.target.result;
      this.contentMarkdown = result.substring(5 + file.type.length + 8);
    };

    reader.readAsDataURL(file);
  }

  ok() {
    let page = this.page;
    let res = this.resource;
    // update in Db
    this.nonFhirResourceService.save(this.resource.id, this.resource).subscribe({
      next: (nonFhir: INonFhirResource) => {
          res.id = nonFhir.id;
          this.activeModal.close({page, res});
        },
      error: (err) => {

      }
    });

  }

  ngOnInit() {
    const allPages: ImplementationGuidePageComponent[] = [];
    const getPages = (parent: ImplementationGuidePageComponent) => {
      allPages.push(parent);
      (parent.page || []).forEach(p => getPages(p));
    };

    if (this.implementationGuide.definition && this.implementationGuide.definition.page) {
      getPages(this.implementationGuide.definition.page);
    }

    this.pageNavMenus = allPages
      .filter(p => !!p.navMenu)
      .map(p => p.navMenu)
      .reduce<string[]>((prev, curr) => {
        if (prev.indexOf(curr) < 0) prev.push(curr);
        return prev;
      }, [])
      .sort((a, b) => (a > b ? 1 : -1));
  }
}
