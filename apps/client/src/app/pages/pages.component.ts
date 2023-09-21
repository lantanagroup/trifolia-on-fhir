import {Component, OnInit} from '@angular/core';
import {CodeSystem, OperationDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute} from '@angular/router';
import {IProject, NonFhirResourceType, Page} from '@trifolia-fhir/models';
import {NonFhirResourceService} from '../shared/non-fhir-resource.service';

@Component({
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent extends BaseComponent implements OnInit {
  public igPages;
  public total = 0;
  public nameText: string;
  public page = 1;
  public criteriaChangedEvent = new Subject<void>();
  public Globals = Globals;


  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private nonFhirResourceService: NonFhirResourceService,
    private modalService: NgbModal,
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
    if (page.name !== 'Index') {
      if (!confirm(`Are you sure you want to delete the page ${ page.name || page.id}`)) {
        return;
      }
      let id = page.id;
      this.nonFhirResourceService.delete(page.id)
        .subscribe((nonFhir: Page) => {
          console.log(nonFhir);
          const page = (this.igPages.results || []).find((e) => e.id === id);
          const index = this.igPages.results.indexOf(page);
          this.total --;
          this.igPages.results.splice(index, 1);
        }, (err) => {
          this.configService.handleError(err, 'An error occurred while deleting the code system');
        });
    }
  }

  public changeId(codeSystem: CodeSystem) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.resourceType = codeSystem.resourceType;
    modalRef.componentInstance.originalId = codeSystem.id;
    modalRef.result.then((newId) => {
      codeSystem.id = newId;
    });
  }

  public getImplementationGuideId(){
    return this.route.snapshot.paramMap.get('implementationGuideId');
  }

  public async getPages() {
    this.nonFhirResourceService.search(this.page, 'name', {"content": 0}, this.getImplementationGuideId(), NonFhirResourceType.Page).toPromise().then((results) => {
      this.igPages = results;
      this.total = this.igPages.total;
    }).catch((err) => console.log(err));

  }

  async ngOnInit() {
    await this.getPages();
  }
}
