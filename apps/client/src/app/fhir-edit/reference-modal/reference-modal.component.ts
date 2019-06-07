import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Bundle, Coding, EntryComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirDisplayPipe} from '../../shared-ui/fhir-display-pipe';
import {HttpClient} from '@angular/common/http';
import {FhirService} from '../../shared/fhir.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';

export interface ResourceSelection {
  resourceType: string;
  id: string;
  display?: string;
  fullUrl?: string;
  resource?: any;
}

@Component({
  selector: 'app-fhir-reference-modal',
  templateUrl: './reference-modal.component.html',
  styleUrls: ['./reference-modal.component.css']
})
export class FhirReferenceModalComponent implements OnInit {
  @Input() public resourceType?: string;
  @Input() public hideResourceType?: boolean;
  @Input() public selectMultiple = false;
  public idSearch?: string;
  public contentSearch?: string;
  public criteriaChangedEvent: Subject<string> = new Subject<string>();
  public nameSearch?: string;
  public titleSearch?: string;
  public selected: ResourceSelection[] = [];
  public results?: Bundle;
  public resourceTypeCodes: Coding[] = [];
  public nameSearchTypes: string[] = [];
  public titleSearchTypes: string[] = [];
  public message: string;

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private fhirService: FhirService) {

    this.criteriaChangedEvent
      .pipe(
        debounceTime(500),
        distinctUntilChanged())
      .subscribe(() => this.criteriaChanged());
  }

  public get showContentSearch() {
    return this.resourceType && this.nameSearchTypes.concat(this.titleSearchTypes).indexOf(this.resourceType) < 0;
  }

  public get showNameSearch() {
    return this.nameSearchTypes.indexOf(this.resourceType) >= 0;
  }

  public get showTitleSearch() {
    return this.titleSearchTypes.indexOf(this.resourceType) >= 0;
  }

  public isSelected(entry: EntryComponent) {
    return !!this.selected.find((selected) => selected.resourceType === entry.resource.resourceType && selected.id === entry.resource.id);
  }

  public setSelected(entry: EntryComponent, isSelected) {
    const found = this.selected.find((selected) => selected.resourceType === entry.resource.resourceType && selected.id === entry.resource.id);

    if (found && !isSelected) {
      const index = this.selected.indexOf(found);
      this.selected.splice(index, 1);
    } else if (!found && isSelected) {
      this.selected.push({
        resourceType: entry.resource.resourceType,
        id: entry.resource.id,
        display: new FhirDisplayPipe().transform(entry.resource, []),
        fullUrl: entry.fullUrl,
        resource: entry.resource
      });
    }
  }

  public select(resourceEntry?) {
    if (resourceEntry) {
      this.activeModal.close(<ResourceSelection>{
        resourceType: resourceEntry.resource.resourceType,
        id: resourceEntry.resource.id,
        display: new FhirDisplayPipe().transform(resourceEntry.resource, []),
        fullUrl: resourceEntry.fullUrl,
        resource: resourceEntry.resource
      });
    } else if (this.selectMultiple) {
      this.activeModal.close(this.selected);
    }
  }

  criteriaChanged(loadMore?: boolean) {
    if (!loadMore) {
      this.results = null;
    }

    if (!this.resourceType) {
      return;
    }

    const nonContentResourceTypes = this.nameSearchTypes.concat(this.titleSearchTypes);
    let url = '/api/fhir/' + this.resourceType + '?_summary=true&_count=10&';

    if (this.results && this.results.entry) {
      url += '_getpagesoffset=' + this.results.entry.length + '&';
    }

    if (this.contentSearch && nonContentResourceTypes.indexOf(this.resourceType) < 0) {
      url += '_content=' + encodeURIComponent(this.contentSearch) + '&';
    }

    if (this.nameSearch && this.nameSearchTypes.indexOf(this.resourceType) >= 0) {
      url += 'name:contains=' + encodeURIComponent(this.nameSearch) + '&';
    }

    if (this.titleSearch && this.titleSearchTypes.indexOf(this.resourceType) >= 0) {
      url += 'title:contains=' + encodeURIComponent(this.titleSearch) + '&';
    }

    if (this.idSearch) {
      url += '_id=' + encodeURIComponent(this.idSearch) + '&';
    }

    this.http.get(url)
      .subscribe((results: Bundle) => {
        if (this.results) {
          this.results.entry = this.results.entry.concat(results.entry);
        } else {
          this.results = results;
        }
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  ngOnInit() {
    this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.criteriaChanged();
    this.nameSearchTypes = this.fhirService.findResourceTypesWithSearchParam('name');
    this.titleSearchTypes = this.fhirService.findResourceTypesWithSearchParam('title');
  }
}
