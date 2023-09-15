import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Coding} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirDisplayPipe} from '../../shared-ui/fhir-display-pipe';
import {HttpClient} from '@angular/common/http';
import {FhirService} from '../../shared/fhir.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ConfigService} from '../../shared/config.service';
import {ConformanceService} from '../../shared/conformance.service';
import {IConformance} from '@trifolia-fhir/models';
import {Paginated} from '@trifolia-fhir/tof-lib';
import {ValueSetService} from '../../shared/value-set.service';
import {ValueSet} from '@trifolia-fhir/r4';


export interface ResourceSelection {
  projectResourceId: string;
  resourceType: string;
  id: string;
  display?: string;
  fullUrl?: string;
  resource?: any;
}

@Component({
  templateUrl: './reference-modal.component.html',
  styleUrls: ['./reference-modal.component.css']
})
export class FhirReferenceModalComponent implements OnInit {
  @Input() public modalTitle = 'Select a resource';
  @Input() public resourceType?: string;
  @Input() public hideResourceType?: boolean;
  @Input() public selectMultiple = false;
  @Input() public allowCoreProfiles = true;
  @Input() public searchLocation: 'base' | 'server' | 'dependency' | 'vsac' = 'server';
  @Input() public structureDefinitionType?: string;
  @Input() public fhirVersion: 'stu3'|'r4'|'r5' = 'stu3';
  public idSearch?: string;
  public contentSearch?: string;
  public apiKey: string;
  public criteriaChangedEvent: Subject<string> = new Subject<string>();
  public nameSearch?: string;
  public titleSearch?: string;
  public selected: ResourceSelection[] = [];
  public results?: IConformance[];
  public valueSetResult?: ValueSet;
  public total: number;
  public currentPage: number = 1;
  public pageChanged: Subject<void> = new Subject<void>();
  public resourceTypeCodes: Coding[] = [];
  public nameSearchTypes: string[] = [];
  public titleSearchTypes: string[] = [];
  public message: string;
  public baseResourceLength: number;
  public ignoreContext = false;
  public searching = false;

  constructor(
    public activeModal: NgbActiveModal,
    public configService: ConfigService,
    public valueSetService: ValueSetService,
    protected conformanceService: ConformanceService,
    private http: HttpClient,
    private fhirService: FhirService) {

    this.criteriaChangedEvent
      .pipe(
        debounceTime(500),
        distinctUntilChanged())
      .subscribe(() => this.criteriaChanged());

      this.pageChanged.subscribe(() => this.criteriaChanged());
  }

  public get resourcesFromContext(): boolean {
    return !this.ignoreContext;
  }

  public set resourcesFromContext(value: boolean) {
    this.ignoreContext = !value;
  }

  public get showContentSearch() {
    return false;
  }

  public get showNameSearch() {
    return true;
  }

  public get showTitleSearch() {
    return true;
  }

  public isSelected(con: IConformance) {
    return !!this.selected.find((selected) => selected.projectResourceId === con.resource.id);
  }

  public setSelected(conf: IConformance, isSelected) {
    const found = this.selected.find((selected) => selected.projectResourceId === conf.id);

    if (found && !isSelected) {
      const index = this.selected.indexOf(found);
      this.selected.splice(index, 1);
    } else if (!found && isSelected) {
      this.selected.push({
        projectResourceId: conf.id,
        resourceType: conf.resource.resourceType,
        id: conf.resource.id,
        display: new FhirDisplayPipe().transform(conf.resource),
        fullUrl: conf.resource['url'],
        resource: conf.resource
      });
    }
  }

  public select(conf?: IConformance) {
    if (conf) {
      this.activeModal.close(<ResourceSelection>{
        projectResourceId: conf.id,
        resourceType: conf.resource.resourceType,
        id: conf.resource.id,
        display: new FhirDisplayPipe().transform(conf.resource),
        fullUrl: conf.resource['url'],
        resource: conf.resource
      });
    } else if (this.selectMultiple) {
      this.activeModal.close(this.selected);
    }
  }

  tabChanged(event) {
    this.searchLocation = event.nextId;
    this.criteriaChanged();
  }

  private searchServer() {

    this.searching = true;

    let igId: string;
    if (!this.ignoreContext && this.configService.project && this.configService.project.implementationGuideId) {
      igId = this.configService.project.implementationGuideId;
    }


    this.conformanceService.search(this.currentPage, 'name', this.configService.fhirVersion, igId, this.resourceType,
      this.nameSearch ? this.nameSearch : null,
       this.titleSearch ? this.titleSearch : null,
      this.idSearch
    ).subscribe({
      next: (res: Paginated<IConformance>) => {

        this.results = res.results;
        this.total = res.total;

      },
      error: (err) => {
      },
      complete: () => {
        this.searching = false;
      }
    });

  }

  criteriaChanged() {

    this.results = null;

    if (!this.resourceType) {
      return;
    }

    switch (this.searchLocation) {
      case 'base':
        this.searchBase();
        break;
      case 'server':
        this.searchServer();
        break;
      case 'dependency':
        this.searchDependency();
        break;
      case 'vsac':
        this.searchVSAC();
        break;
    }
  }

  private searchDependency() {
    const nonContentResourceTypes = this.nameSearchTypes.concat(this.titleSearchTypes);
    let url = '/api/fhir/dependency?';

    // if (this.resourceType) {
    //   url += `resourceType=${this.resourceType}&`;
    // }

    // if (this.results && this.results.entry) {
    //   url += '_getpagesoffset=' + this.results.entry.length + '&';
    // }

    // if (this.contentSearch && nonContentResourceTypes.indexOf(this.resourceType) < 0) {
    //   url += '_content=' + encodeURIComponent(this.contentSearch) + '&';
    // }

    // if (this.nameSearch && this.nameSearchTypes.indexOf(this.resourceType) >= 0) {
    //   url += 'name=' + encodeURIComponent(this.nameSearch) + '&';
    // }

    // if (this.titleSearch && this.titleSearchTypes.indexOf(this.resourceType) >= 0) {
    //   url += 'title=' + encodeURIComponent(this.titleSearch) + '&';
    // }

    // if (this.resourceType === 'StructureDefinition' && this.structureDefinitionType) {
    //   url += 'type=' + encodeURIComponent(this.structureDefinitionType) + '&';
    // }

    // if (this.idSearch) {
    //   url += '_id=' + encodeURIComponent(this.idSearch) + '&';
    // }

    // this.searching = true;

    // this.http.get<IBundle>(url)
    //   .subscribe((results: IBundle) => {
    //     // If we are loading more results from the server, then concatenate the entries
    //     if (loadMore && this.results && this.results.entry) {
    //       this.results.entry = this.results.entry.concat(results.entry);
    //     } else {
    //       this.results = results;
    //     }

    //     this.searching = false;
    //   }, (err) => {
    //     this.message = getErrorString(err);
    //     this.searching = false;
    //   }, () => this.searching = false);

  }

  private searchBase() {

    // if (!this.results) {
    //   this.results = {
    //     resourceType: 'Bundle',
    //     entry: []
    //   };
    //   this.baseResourceLength = 10;
    // }

    // let additionalEntries: EntryComponent[] = this.fhirService.fhir.parser.structureDefinitions
    //   .map((sd: StructureDefinition) => {
    //     return {
    //       resource: sd
    //     };
    //   });

    // if (this.nameSearch) {
    //   additionalEntries = additionalEntries
    //     .filter(object => (<StructureDefinition> object.resource).name.toLowerCase().indexOf(this.nameSearch.toLowerCase()) >= 0);
    // }

    // if (this.titleSearch) {
    //   additionalEntries = additionalEntries
    //     .filter(object => (<StructureDefinition> object.resource).title.toLowerCase().indexOf(this.titleSearch.toLowerCase()) >= 0);
    // }

    // if (this.idSearch) {
    //   additionalEntries = additionalEntries
    //     .filter(object => (<StructureDefinition> object.resource).identifier.filter(value => (<String> value).toLowerCase().indexOf(this.idSearch.toLowerCase()) >= 0));
    // }

    // if (this.structureDefinitionType) {
    //   additionalEntries = additionalEntries
    //     .filter(e => e.resource.resourceType !== 'StructureDefinition' || (<StructureDefinition> e.resource).type.toLowerCase() === this.structureDefinitionType.toLowerCase());
    // }

    // this.results.entry = additionalEntries;
    // this.results.total = this.results.entry.length;
    // this.baseResourceLength = loadMore ? (this.baseResourceLength + 10 < this.results.total ? this.baseResourceLength + 10 : this.results.total) : this.baseResourceLength;
    // this.results.entry = this.results.entry.slice(0, this.baseResourceLength);

  }

  private searchVSAC() {

    this.searching = true;

    const valueSet = this.valueSetService.searchVsacApi(this.idSearch, this.apiKey);

  }

  ngOnInit() {
    this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.criteriaChanged();
    //this.nameSearchTypes = this.fhirService.findResourceTypesWithSearchParam('name');
    //this.titleSearchTypes = this.fhirService.findResourceTypesWithSearchParam('title');
  }
}
