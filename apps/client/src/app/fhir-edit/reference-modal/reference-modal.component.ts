import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Coding, EntryComponent, StructureDefinition } from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { FhirDisplayPipe } from '../../shared-ui/fhir-display-pipe';
import { HttpClient } from '@angular/common/http';
import { FhirService } from '../../shared/fhir.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfigService } from '../../shared/config.service';
import { FhirResourceService } from '../../shared/fhir-resource.service';
import { IFhirResource, IProjectResourceReference } from '@trifolia-fhir/models';
import { IBundle, IDomainResource, IValueSet, Paginated } from '@trifolia-fhir/tof-lib';
import {ValueSetService} from '../../shared/value-set.service';
import { CookieService } from 'ngx-cookie-service';

export interface ResourceSelection {
  projectResourceId?: string;
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
  public rememberVsacCredentials: boolean = false;
  public criteriaChangedEvent: Subject<string> = new Subject<string>();
  public nameSearch?: string;
  public titleSearch?: string;
  public selected: ResourceSelection[] = [];
  public serverResults?: IFhirResource[];
  public fhirResults?: IBundle;
  public valueSetResults?: IValueSet[];
  public total: number;
  public currentPage: number = 1;
  public pageSize: number = 5;
  public pageChanged: Subject<void> = new Subject<void>();
  public resourceTypeCodes: Coding[] = [];
  public nameSearchTypes: string[] = [];
  public titleSearchTypes: string[] = [];
  public message: string;
  public vsacMessage: string;
  public baseResourceLength: number;
  public ignoreContext = false;
  public searching = false;

  private readonly vsacPasswordCookieKey = 'vsac_password';

  constructor(
    public activeModal: NgbActiveModal,
    public configService: ConfigService,
    public valueSetService: ValueSetService,
    protected fhirResourceService: FhirResourceService,
    private cookieService: CookieService,
    private http: HttpClient,
    private fhirService: FhirService) {

    this.criteriaChangedEvent
      .pipe(
        debounceTime(500),
        distinctUntilChanged())
      .subscribe(() => this.criteriaChanged());

      this.pageChanged.subscribe(() => this.getPage());

      const vsacPassword = this.cookieService.get(this.vsacPasswordCookieKey);

      if (vsacPassword) {
        this.apiKey = atob(vsacPassword);
        this.rememberVsacCredentials = true;
      }
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

  public isSelected(con: IFhirResource) {
    return !!this.selected.find((selected) => selected.projectResourceId === con.resource.id);
  }

  public setSelected(res: IFhirResource|IDomainResource, type: 'server'|'fhir', isSelected: boolean) {
    const found = this.selected.find((selected) => selected.projectResourceId === res.id);

    if (found && !isSelected) {
      const index = this.selected.indexOf(found);
      this.selected.splice(index, 1);
    } else if (!found && isSelected) {
      this.selected.push({
        projectResourceId: res.id,
        resourceType: type === 'server' ? (<IFhirResource>res).resource.resourceType : (<IDomainResource>res).resourceType,
        id: type === 'server' ? (<IFhirResource>res).resource.id : (<IDomainResource>res).id,
        display: new FhirDisplayPipe().transform(type === 'server' ? (<IFhirResource>res).resource : res),
        fullUrl: type === 'server' ? (<IFhirResource>res).resource['url'] : res['url'],
        resource: type === 'server' ? (<IFhirResource>res).resource : res
      });
    }
  }

  public selectServer(conf?: IFhirResource) {
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

  public selectFhir(res?: IDomainResource) {
    if (res) {
      this.activeModal.close(<ResourceSelection>{
        resourceType: res.resourceType,
        id: res.id,
        display: new FhirDisplayPipe().transform(res),
        fullUrl: res['url'],
        resource: res
      });
    } else if (this.selectMultiple) {
      this.activeModal.close(this.selected);
    }
  }

  public selectVsac(valueSet: IValueSet) {
    if (valueSet) {
      this.activeModal.close(<ResourceSelection>{
        resourceType: 'ValueSet',
        id: valueSet.id,
        display: new FhirDisplayPipe().transform(valueSet),
        fullUrl: valueSet['url'],
        resource: valueSet
      })
    }
  }

  tabChanged(event) {
    this.searchLocation = event.nextId;
    this.criteriaChanged();
  }
  

  getImplementationGuideDisplay(referencedBy: IProjectResourceReference[]): string {
    return (referencedBy || []).map(r => r.value).join(', ');
  }

  private searchServer() {

    this.searching = true;

    let igId: string;
    if (!this.ignoreContext && this.configService.igContext && this.configService.igContext.implementationGuideId) {
      igId = this.configService.igContext.implementationGuideId;
    }


    this.fhirResourceService.search(this.currentPage, 'name', this.configService.fhirVersion, igId, this.resourceType,
      this.nameSearch ? this.nameSearch : null,
       this.titleSearch ? this.titleSearch : null,
      this.idSearch
    ).subscribe({
      next: (res: Paginated<IFhirResource>) => {

        this.serverResults = res.results;
        this.total = res.total;
        this.pageSize = res.itemsPerPage;
        this.searching = false;
      },
      error: (err) => {
        this.searching = false;
      }
    });

  }


  criteriaChanged() {
    this.currentPage = 1;
    this.getPage();
  }

  getPage() {

    this.serverResults = null;
    this.fhirResults = null;
    this.valueSetResults = null;

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

    if (this.resourceType) {
      url += `resourceType=${this.resourceType}&`;
    }

    // if (this.results && this.results.entry) {
    //   url += '_getpagesoffset=' + this.results.entry.length + '&';
    // }

    if (this.contentSearch && nonContentResourceTypes.indexOf(this.resourceType) < 0) {
      url += '_content=' + encodeURIComponent(this.contentSearch) + '&';
    }

    if (this.nameSearch) {
      url += 'name=' + encodeURIComponent(this.nameSearch) + '&';
    }

    if (this.titleSearch) {
      url += 'title=' + encodeURIComponent(this.titleSearch) + '&';
    }

    if (this.resourceType === 'StructureDefinition' && this.structureDefinitionType) {
      url += 'type=' + encodeURIComponent(this.structureDefinitionType) + '&';
    }

    if (this.idSearch) {
      url += '_id=' + encodeURIComponent(this.idSearch) + '&';
    }

    this.searching = true;

    this.http.get<IBundle>(url).subscribe({
      next: (results: IBundle) => {
        this.fhirResults = results;
        this.searching = false;
      },
      error: (err) => {
        this.message = err.message;
        this.searching = false;
      },
      complete: () => (this.searching = false)
    });

  }

  private searchBase() {

    if (!this.fhirResults) {
      this.fhirResults = {
        resourceType: 'Bundle',
        entry: []
      };
      this.baseResourceLength = 10;
    }

    let entries: EntryComponent[] = this.fhirService.fhir.parser.structureDefinitions
      .map((sd: StructureDefinition) => {
        return {
          resource: sd
        };
      });

    if (this.nameSearch) {
      entries = entries
        .filter(object => (<StructureDefinition> object.resource).name?.toLowerCase().indexOf(this.nameSearch.toLowerCase()) >= 0);
    }

    if (this.titleSearch) {
      entries = entries
        .filter(object => (<StructureDefinition> object.resource).title?.toLowerCase().indexOf(this.titleSearch.toLowerCase()) >= 0);
    }

    if (this.idSearch) {
      entries = entries
        .filter(object => (<StructureDefinition> object.resource).identifier?.filter(value => (<String> value).toLowerCase().indexOf(this.idSearch.toLowerCase()) >= 0));
    }

    if (this.structureDefinitionType) {
      entries = entries
        .filter(e => e.resource.resourceType !== 'StructureDefinition' || (<StructureDefinition> e.resource).type.toLowerCase() === this.structureDefinitionType.toLowerCase());
    }

    this.fhirResults.entry = entries;
    this.fhirResults.total = this.fhirResults.entry?.length || 0;

  }

  get vsacSearchDisabled(): boolean {
    return !this.apiKey || (!this.idSearch && !this.nameSearch);
  }

  private searchVSAC() {

    this.searching = false;
    this.valueSetResults = null;
    this.vsacMessage = '';

    if (this.rememberVsacCredentials) {
      this.cookieService.set(this.vsacPasswordCookieKey, btoa(this.apiKey));
    }

    if (this.vsacSearchDisabled) {
      return;
    }

    this.searching = true;


    this.valueSetService.searchVsacApi(this.currentPage, this.apiKey, this.idSearch, this.nameSearch).subscribe({
      next: (res: Paginated<IValueSet>) => {
        this.valueSetResults = res.results;
        this.total = res.total;
        this.pageSize = res.itemsPerPage;
        this.searching = false;
      },
      error: (err) => {
        console.log('err:', err);
        this.searching = false;
        this.vsacMessage = err.error?.message ?? err.message;
      }
    });



  }

  ngOnInit() {
    this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.criteriaChanged();
    //this.nameSearchTypes = this.fhirService.findResourceTypesWithSearchParam('name');
    //this.titleSearchTypes = this.fhirService.findResourceTypesWithSearchParam('title');
  }
}
