import {Component, OnInit} from '@angular/core';
import {ValueSetService} from '../shared/value-set.service';
import {Bundle, ValueSet} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
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

@Component({
  templateUrl: './valuesets.component.html',
  styleUrls: ['./valuesets.component.css']
})
export class ValuesetsComponent extends BaseComponent implements OnInit {
  public results: Bundle;
  public nameText: string;
  public idText: string;
  public page = 1;
  public urlText: string;
  public criteriaChangedEvent = new Subject();
  public message: string;
  public Globals = Globals;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private fhirService: FhirService,
    private valueSetService: ValueSetService,
    private modalService: NgbModal) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getValueSets();
      });
  }

  public get valueSets() {
    if (!this.results || !this.results.entry) {
      return [];
    }

    return this.results.entry.map((entry) => <ValueSet>entry.resource);
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
        const entry = this.results.entry.find((e) => e.resource.id === valueSet.id);
        const index = this.results.entry.indexOf(entry);
        this.results.entry.splice(index, index >= 0 ? 1 : 0);
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
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
    modalRef.componentInstance.resourceType = valueSet.resourceType;
    modalRef.componentInstance.originalId = valueSet.id;
    modalRef.result.then((newId) => {
      valueSet.id = newId;
    });
  }

  public getValueSets() {
    this.results = null;
    this.message = 'Searching value sets...';

    this.valueSetService.search(this.page, this.nameText, this.urlText, this.idText)
      .subscribe((results: Bundle) => {
        this.results = results;
        this.message = '';
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while searching for value sets');
      });
  }

  ngOnInit() {
    this.getValueSets();
    this.configService.fhirServerChanged.subscribe(() => this.getValueSets());
  }
}
