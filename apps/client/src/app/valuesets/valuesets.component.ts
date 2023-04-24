import {Component, OnInit} from '@angular/core';
import {ValueSetService} from '../shared/value-set.service';
import {Bundle, CodeSystem, ValueSet} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {ConfigService} from '../shared/config.service';
import {FhirService} from '../shared/fhir.service';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './valuesets.component.html',
  styleUrls: ['./valuesets.component.css']
})
export class ValuesetsComponent extends BaseComponent implements OnInit {
  public valueSet;
  public total: string;
  public nameText: string;
  public idText: string;
  public page = 1;
  public urlText: string;
  public criteriaChangedEvent = new Subject<void>();
  public message: string;
  public Globals = Globals;
  public valueSetId;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private fhirService: FhirService,
    private valueSetService: ValueSetService,
    private modalService: NgbModal,
    public route: ActivatedRoute) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getValueSets();
      });
  }

  public get valueSets() {
    if (!this.valueSet) {
      return [];
    }

    return this.valueSet.results.map((entry) => <ValueSet>entry);
  }

  public clearFilters() {
    this.nameText = null;
    this.urlText = null;
    this.idText = null;
    this.page = 1;
    this.criteriaChanged();
  }

  public remove(valueSet: ValueSet) {
    if (!confirm(`Are you sure you want to delete the value set ${valueSet.title || valueSet.name || 'no-name'}`)) {
      return;
    }

    this.valueSetService.delete(valueSet.id)
      .subscribe(() => {
        this.message = `Successfully deleted value set ${valueSet.title || valueSet.name || 'no-name'} (${valueSet.id})`;
        const entry = (this.valueSet.results || []).find((e) => e.id === valueSet.id);
        const index = this.valueSet.results.indexOf(entry);
        this.valueSet.results.splice(index, index >= 0 ? 1 : 0);
        setTimeout(() => this.message = '', 3000);
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  public criteriaChanged() {
    this.criteriaChangedEvent.next();
  }

  public idTextChanged(value) {
    this.idText = <string>value;
    this.page = 1;
    this.criteriaChanged();
  }

  public nameTextChanged(value) {
    this.nameText = <string>value;
    this.page = 1;
    this.criteriaChanged();
  }

  public urlTextChanged(value) {
    this.urlText = <string>value;
    this.page = 1;
    this.criteriaChanged();
  }

  public changeId(valueSet: ValueSet) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.resourceType = valueSet.resourceType;
    modalRef.componentInstance.originalId = valueSet.id;
    modalRef.result.then((newId) => {
      valueSet.id = newId;
    });
  }

  public getImplementationGuideId(){
    return this.route.snapshot.paramMap.get('implementationGuideId');
  }

  public getValueSets() {
    this.valueSet = null;
    this.message = 'Searching value sets...';

    this.valueSetService.searchValueSet(this.page, this.nameText, this.urlText, this.idText, this.getImplementationGuideId())
      .subscribe((results: Bundle) => {
        this.valueSet = results;
        this.total = this.valueSet.total;
        this.message = '';
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while searching for value sets');
      });
  }

  ngOnInit() {
    this.getValueSets();
  }
}
