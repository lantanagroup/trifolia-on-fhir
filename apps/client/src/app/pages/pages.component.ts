import {Component, OnInit} from '@angular/core';
import {CodeSystem, ImplementationGuide as STU3ImplementationGuide, OperationDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../shared/config.service';
import {firstValueFrom, Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute} from '@angular/router';
import {IProject, NonFhirResourceType, Page} from '@trifolia-fhir/models';
import {NonFhirResourceService} from '../shared/non-fhir-resource.service';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {Versions as FhirVersions} from 'fhir/fhir';
import {IImplementationGuide} from '@trifolia-fhir/tof-lib';
import {ImplementationGuide as R4ImplementationGuide} from '@trifolia-fhir/r4';
import {STU3ImplementationGuideComponent} from '../implementation-guide-wrapper/stu3/implementation-guide.component';

@Component({
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent extends BaseComponent implements OnInit {
  public igPages;
  //public total = 0;
  public nameText: string;
  public defaultName = '';
  public page = 1;
  public criteriaChangedEvent = new Subject<void>();
  public Globals = Globals;
  public missingPages = [];


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
        this.getPages();
      });
  }

  public get searchPagesResults(): IProject[] {
    if (this.igPages) {
      return (this.igPages.results || []).map((entry) => <IProject>entry);
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

  public remove(page: Page) {
  //  if (page.name !== 'Index') {
      if (!confirm(`Are you sure you want to delete the page ${page.name || page.id}`)) {
        return;
      }
      let id = page.id;
      this.nonFhirResourceService.delete(page.id)
        .subscribe((nonFhir: Page) => {
          console.log(nonFhir);
          const page = (this.igPages.results || []).find((e) => e.id === id);
          const index = this.igPages.results.indexOf(page);
          this.igPages.total --;
          if (this.igPages.total == 0) {
            this.defaultName = 'index';
          }
          this.igPages.results.splice(index, 1);
        }, (err) => {
          this.configService.handleError(err, 'An error occurred while deleting the code system');
        });
    //}
  }

  public changeId(codeSystem: CodeSystem) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.resourceType = codeSystem.resourceType;
    modalRef.componentInstance.originalId = codeSystem.id;
    modalRef.result.then((newId) => {
      codeSystem.id = newId;
    });
  }

  public getImplementationGuideId() {
    return this.route.snapshot.paramMap.get('implementationGuideId');
  }

  public async setMissingPages() {
    this.missingPages = [];
    let results;
    let implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    if (implementationGuideId) {
      let conf = await firstValueFrom(this.igService.getImplementationGuide(implementationGuideId));
      let implementationGuide = <IImplementationGuide>conf.resource;
      if (conf.fhirVersion.toLowerCase() == FhirVersions.R4.toLowerCase()) {
        const ig4 = <R4ImplementationGuide>implementationGuide;
        results = this.findIgPages(ig4.definition.page, [], conf.fhirVersion);
      }
      else  if (conf.fhirVersion.toLowerCase() == FhirVersions.STU3.toLowerCase()) {
        const stu3 = <STU3ImplementationGuide>implementationGuide;
        results = this.findIgPages(stu3.page, [], conf.fhirVersion);
      }
      (results || []).forEach(res => {
          if (this.igPages.total == 0) {
            (this.missingPages || []).push(res);
          } else {
            let index = (this.igPages.results || []).findIndex(pg => pg.name == res);
            if (index == -1) {
              (this.missingPages || []).push(res);
            }
          }
        });
      }
  }

  public async getPages() {
    this.nonFhirResourceService.search(this.page, 'name', { 'content': 0 }, this.getImplementationGuideId(), NonFhirResourceType.Page).toPromise().then((results) => {
      this.igPages = results;
      if(this.igPages.total == 0){
        this.defaultName = "index";
      }
      this.setMissingPages();

    }).catch((err) => console.log(err));

  }

  private findIgPages(page: any, results, version: string) {
    if (!page) {
      return results;
    }
    results.push(page.nameUrl.slice(0, page.nameUrl.indexOf('.')));
    if (page.page) {
      for (let i = 0; i < page.page.length; i++) {
        let pg = page.page[i].nameUrl;
        let name = pg.slice(0, pg.indexOf('.'));
        results.push(name);
        this.findIgPages(page[i], results, version);
      }
    }
    return results;
  }

  async ngOnInit() {
    await this.getPages();
  }
}
