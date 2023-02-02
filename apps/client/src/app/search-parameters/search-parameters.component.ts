import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from 'libs/tof-lib/src/lib/globals';
import { Bundle, SearchParameter } from 'libs/tof-lib/src/lib/stu3/fhir';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';
import { ConfigService } from '../shared/config.service';
import { SearchParameterService } from '../shared/search-parameter.service';
import { ChangeResourceIdModalComponent } from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import { BaseComponent } from '../base.component';

@Component({
  templateUrl: './search-parameters.component.html',
  styleUrls: ['./search-parameters.component.css']
})
export class SearchParametersComponent extends BaseComponent implements OnInit {

  public searchParameterBundle: Bundle;
  public nameText: string;
  public criteriaChangedEvent = new Subject<void>();
  public page = 1;
  public Globals = Globals;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private spService: SearchParameterService,
    private modalService: NgbModal) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getSearchParameters();
      });
  }

  public get searchParameter(): SearchParameter[] {
    if (!this.searchParameterBundle || !this.searchParameterBundle.entry) {
      return [];
    }

    return this.searchParameterBundle.entry.map((entry) => <SearchParameter>entry.resource);
  }

  public remove(searchParameter: SearchParameter) {
    if (!confirm(`Are you sure you want to delete the search parameter ${searchParameter.base || searchParameter.name || searchParameter.id}`)) {
      return;
    }

    this.spService.delete(searchParameter.id)
      .subscribe(() => {
        const entry = (this.searchParameterBundle.entry || []).find((e) => e.resource.id === searchParameter.id);
        const index = this.searchParameterBundle.entry.indexOf(entry);
        this.searchParameterBundle.entry.splice(index, 1);
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while deleting the capability statement');
      });
  }

  public nameTextChanged(value: string) {
    this.nameText = value;
    this.page = 1;
    this.criteriaChanged();
  }

  public changeId(searchParameter: SearchParameter) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.resourceType = searchParameter.resourceType;
    modalRef.componentInstance.originalId = searchParameter.id;
    modalRef.result.then((newId) => {
      searchParameter.id = newId;
    });
  }

  public getSearchParameters() {
    this.searchParameterBundle = null;

    this.spService.search(this.page, this.nameText)
      .subscribe((results) => {
        this.searchParameterBundle = results;
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while searching for capability statements');
      });
  }

  public clearFilters() {
    this.nameText = null;
    this.criteriaChanged();
  }

  public criteriaChanged() {
    this.criteriaChangedEvent.next();
  }

  ngOnInit() {
    this.getSearchParameters();
  }

}
