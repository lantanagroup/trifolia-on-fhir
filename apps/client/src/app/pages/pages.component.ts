import {Component, OnInit} from '@angular/core';
import {ImplementationGuide as STU3ImplementationGuide, OperationDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../shared/config.service';
import {firstValueFrom, Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute} from '@angular/router';
import {NonFhirResourceType, Page} from '@trifolia-fhir/models';
import {NonFhirResourceService} from '../shared/non-fhir-resource.service';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {Versions as FhirVersions} from 'fhir/fhir';
import {IImplementationGuide} from '@trifolia-fhir/tof-lib';
import {ImplementationGuide as R4ImplementationGuide} from '@trifolia-fhir/r4';

@Component({
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent extends BaseComponent implements OnInit {
  public igPages;
  public nameText: string;
  public page = 1;
  public criteriaChangedEvent = new Subject<void>();
  public Globals = Globals;
  public missingPages = [];
  public total;


  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private nonFhirResourceService: NonFhirResourceService,
    private modalService: NgbModal,
    private igService: ImplementationGuideService,
    public route: ActivatedRoute) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.searchPagesByName();
      });
  }

  public get searchPagesResults(): [] {
    if (this.igPages) {
      return (this.igPages.results || []);
    }
    return [];
  }



  public nameTextChanged(value: string) {
    this.nameText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public clearFilters() {
    this.nameText = null;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  get defaultName(){
    return (this.total == 0)?'index':"";
  }

  public remove(page: Page) {
    if (!confirm(`Are you sure you want to delete Page: ${page.name || page.id}`)) {
      return;
    }
    let id = page.id;
    this.nonFhirResourceService.delete(page.id)
      .subscribe((nonFhir: Page) => {
        const page = (this.igPages.results || []).find((e) => e.id === id);
        const index = this.igPages.results.indexOf(page);
        this.igPages.results.splice(index, 1);
        this.igPages.total--;
        this.total--;
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while deleting the page.');
      });
  }


  public getImplementationGuideId() {
    return this.route.snapshot.paramMap.get('implementationGuideId');
  }

  public async setMissingPages() {
    this.missingPages = [];
    let results = [];
    let implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    if (implementationGuideId) {
      let conf = await firstValueFrom(this.igService.getImplementationGuide(implementationGuideId));
      let implementationGuide = <IImplementationGuide>conf.resource;
      if (conf.fhirVersion.toLowerCase() == FhirVersions.R4.toLowerCase()) {
        const ig4 = <R4ImplementationGuide>implementationGuide;
        if (ig4.definition && ig4.definition.page) {
          results = this.findIgPages(ig4.definition.page, [], conf.fhirVersion);
        }
      } else if (conf.fhirVersion.toLowerCase() == FhirVersions.STU3.toLowerCase()) {
        const stu3 = <STU3ImplementationGuide>implementationGuide;
        results = this.findIgPages(stu3.page, [], conf.fhirVersion);
      }
      for (const res of (results || [])) {
          let page = new Page();
          page.name = res;
          let foundPage = await firstValueFrom(this.nonFhirResourceService.getByName(page, implementationGuideId));
          if(!foundPage.id) {
            (this.missingPages || []).push(res);
          }
      }
    }
  }

  public async getPages() {
    this.nonFhirResourceService.search(this.page, 'name', { 'content': 0 }, this.getImplementationGuideId(), NonFhirResourceType.Page).toPromise().then((results) => {
      this.igPages = results;
      this.total = this.igPages.total;
      this.setMissingPages();

    }).catch((err) => console.log(err));

  }

  public async searchPagesByName() {
    this.nonFhirResourceService.search(this.page, 'name', { 'content': 0 }, this.getImplementationGuideId(), NonFhirResourceType.Page, this.nameText).toPromise().then((results) => {
      this.igPages = results;

    }).catch((err) => console.log(err));

  }

  private findIgPages(page: any, results, version: string) {
    if (!page) {
      return results;
    }
    let pageName;
    if (version.toLowerCase() === FhirVersions.R4.toLowerCase()){
      pageName = page.nameUrl ?? page.nameReference?.reference;
    }
    else  if (version.toLowerCase() === FhirVersions.STU3.toLowerCase()){
      pageName = page.source;
    }
    if (pageName && pageName.indexOf('.') > -1) {
      pageName = pageName.substring(0, pageName.indexOf('.'));
    }
    if(results.indexOf(pageName) == -1) {
      results.push(pageName);
    }

    if (page.page) {
      for (let i = 0; i < page.page.length; i++) {
        this.findIgPages(page.page[i], results, version);
      }
    }
    return results;
  }

  async ngOnInit() {
    await this.getPages();
  }
}
