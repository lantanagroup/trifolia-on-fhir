import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ImplementationGuide,
  ImplementationGuidePageComponent
} from '@trifolia-fhir/r4';
import {getImplementationGuideMediaReferences, IImplementationGuide, MediaReference} from '@trifolia-fhir/tof-lib';
import {Observable} from 'rxjs';
import {debounceTime, distinct, distinctUntilChanged, map} from 'rxjs/operators';
import {IFhirResource, IProjectResourceReference, NonFhirResourceType, Page} from '@trifolia-fhir/models';
import {NonFhirResourceService} from '../../shared/non-fhir-resource.service';

@Component({
  templateUrl: './page-component-modal.component.html',
  styleUrls: ['./page-component-modal.component.css']
})
export class PageComponentModalComponent implements OnInit {
  public inputPage: ImplementationGuidePageComponent;
  public page: ImplementationGuidePageComponent;
  public fhirResource: IFhirResource;
  public implementationGuide: ImplementationGuide;
  public implementationGuideId: string;
  public level: number;
  public pageNavMenus: string[];
  public resource:  Page;

  constructor(public activeModal: NgbActiveModal, protected nonFhirResourceService: NonFhirResourceService) {

  }

  public getMediaReferences(): MediaReference[] {
    return getImplementationGuideMediaReferences('r4', <ImplementationGuide>this.fhirResource.resource);
  }

  public setPage(value: ImplementationGuidePageComponent) {
    this.inputPage = value;
    this.page = new ImplementationGuidePageComponent(this.inputPage);
  }

  public setResource(value: Page) {
    this.resource = value;
  }

  public get contentMarkdown() {
    return this.resource["content"];
  }


  public set contentMarkdown(value: string) {
    if(!this.resource){
      this.resource = new Page();
      this.resource["name"] = this.inputPage.nameUrl.slice(0,this.inputPage.nameUrl.indexOf("."));
    }
    this.resource["content"] = value;
  }

  public get navMenu() {
    return this.resource["navMenu"];
  }


  public set navMenu(value: string) {
    if(!this.resource){
      this.resource = new Page();
      this.resource["name"] = this.inputPage.nameUrl.slice(0,this.inputPage.nameUrl.indexOf("."));
    }
    this.resource["navMenu"] = value;
  }

  public get reuseDescription() {
    return this.resource["reuseDescription"];
  }


  public set reuseDescription(value: boolean) {
    if(!this.resource){
      this.resource = new Page();
      this.resource["name"] = this.inputPage.nameUrl.slice(0,this.inputPage.nameUrl.indexOf("."));
    }
    this.resource["reuseDescription"] = value;
    if(value) {
      this.resource["content"] = "";
    }
  }


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
      this.activeModal.close();
  }

  ngOnInit() {
    const allPages: ImplementationGuidePageComponent[] = [];
    const getPages = (parent: ImplementationGuidePageComponent) => {
      allPages.push(parent);
      (parent.page || []).forEach(p => getPages(p));
    };
    this.implementationGuide = <ImplementationGuide>this.fhirResource.resource
    if (this.implementationGuide.definition && this.implementationGuide.definition.page) {
      getPages(this.implementationGuide.definition.page);
    }

    this.pageNavMenus = allPages
      .filter(p => !!this.navMenu)
      .map(p => this.navMenu)
      .reduce<string[]>((prev, curr) => {
        if (prev.indexOf(curr) < 0) prev.push(curr);
        return prev;
      }, [])
      .sort((a, b) => (a > b ? 1 : -1));
  }
}
