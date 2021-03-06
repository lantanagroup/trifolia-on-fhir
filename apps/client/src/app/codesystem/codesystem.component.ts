import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {RecentItemService} from '../shared/recent-item.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CodeSystemService} from '../shared/code-system.service';
import {CodeSystem as STU3CodeSystem, ConceptDefinitionComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {CodeSystem as R4CodeSystem } from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {FhirService} from '../shared/fhir.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirCodesystemConceptModalComponent} from '../fhir-edit/codesystem-concept-modal/codesystem-concept-modal.component';
import {FileService} from '../shared/file.service';
import {ConfigService} from '../shared/config.service';
import {AuthService} from '../shared/auth.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {BaseComponent} from '../base.component';
import { ICodeSystem } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  templateUrl: './codesystem.component.html',
  styleUrls: ['./codesystem.component.css']
})
export class CodesystemComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  public codeSystem: ICodeSystem;
  public filteredConcepts: ConceptDefinitionComponent[] = [];
  public pagedConcepts: ConceptDefinitionComponent[] = [];
  public message: string;
  public validation: any;
  public searchCode: string;
  public searchDisplay: string;
  public searchDefinition: string;
  public perPage = 10;
  public page = 1;
  public csNotFound = false;
  public Globals = Globals;
  private navSubscription: any;

  public idChangedEvent = new Subject();
  public isIdUnique = true;
  public alreadyInUseIDMessage = '';

  constructor(
    public route: ActivatedRoute,
    public configService: ConfigService,
    protected authService: AuthService,
    private modalService: NgbModal,
    private codeSystemService: CodeSystemService,
    private router: Router,
    private recentItemService: RecentItemService,
    private fileService: FileService,
    private fhirService: FhirService) {

    super(configService, authService);
    if (this.configService.isFhirR4) {
      this.codeSystem = new R4CodeSystem({ meta: this.authService.getDefaultMeta() });
    } else if (this.configService.isFhirSTU3) {
      this.codeSystem = new STU3CodeSystem({ meta: this.authService.getDefaultMeta() });
    }

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        const isIdUnique = await this.fhirService.checkUniqueId(this.codeSystem);
        if(!isIdUnique){
          this.isIdUnique = false;
          this.alreadyInUseIDMessage = "ID " +  this.codeSystem.id  + " is already used.";
        }
        else{
          this.isIdUnique = true;
          this.alreadyInUseIDMessage="";
        }
      });
  }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('id');
    return !id || id === 'new';
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('id') === 'from-file';
  }

  public urlChanged() {
    const lastIndex = this.codeSystem.url.lastIndexOf('/');

    if (lastIndex > 0 && this.isNew) {
      this.codeSystem.id = this.codeSystem.url.substring(lastIndex + 1);
    }
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the code system?')) {
      return;
    }

    this.getCodeSystem();
  }

  public searchCodeChanged(newValue: string) {
    this.searchCode = newValue;
    this.refreshConcepts();
  }

  public searchDisplayChanged(newValue: string) {
    this.searchDisplay = newValue;
    this.refreshConcepts();
  }

  public searchDefinitionChanged(newValue: string) {
    this.searchDefinition = newValue;
    this.refreshConcepts();
  }

  public initConcepts() {
    Globals.toggleProperty(this.codeSystem, 'concept', [{}]);
    this.codeSystem.concept[0].code = '';
    this.refreshConcepts();
  }

  public refreshConcepts() {
    const actualConcepts = <ConceptDefinitionComponent[]>this.codeSystem.concept;
    let filtered = [];

    if (actualConcepts && actualConcepts.length > 0) {
      const lowerSearchCode = this.searchCode ? this.searchCode.toLowerCase() : null;
      const lowerSearchDisplay = this.searchDisplay ? this.searchDisplay.toLowerCase() : null;
      const lowerSearchDefinition = this.searchDefinition ? this.searchDefinition.toLowerCase() : null;

      filtered = actualConcepts.filter((concept: ConceptDefinitionComponent) => {
        const matchesCode = !lowerSearchCode ||
          (concept.code && concept.code.toLowerCase().indexOf(lowerSearchCode) >= 0);
        const matchesDisplay = !lowerSearchDisplay ||
          (concept.display && concept.display.toLowerCase().indexOf(lowerSearchDisplay) >= 0);
        const matchesDefinition = !lowerSearchDefinition ||
          (concept.definition && concept.definition.toLowerCase().indexOf(lowerSearchDefinition) >= 0);

        return matchesCode && matchesDisplay && matchesDefinition;
      });
    }

    const totalPages = Math.ceil(filtered.length / this.perPage);

    if (this.page > totalPages) {
      this.page = totalPages;
    }

    this.filteredConcepts = filtered;

    const startIndex = this.page <= 1 ? 0 : (this.page - 1) * this.perPage;
    this.pagedConcepts = filtered.slice(startIndex, startIndex + this.perPage);
  }

  public removeConcept(concept: ConceptDefinitionComponent) {
    const index = this.codeSystem.concept.indexOf(concept);
    this.codeSystem.concept.splice(index, 1);
    this.refreshConcepts();
  }

  public editConcept(concept: ConceptDefinitionComponent) {
    const modalRef = this.modalService.open(FhirCodesystemConceptModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.concept = concept;
  }

  public addConcept() {
    this.searchCode = null;
    this.searchDisplay = null;
    this.searchDefinition = null;
    this.page = Math.ceil(this.codeSystem.concept.length / this.perPage);
    this.codeSystem.concept.push({ code: '' });
    this.refreshConcepts();
  }

  public save() {
    if (!this.validation.valid && !confirm('This code system is not valid, are you sure you want to save?')) {
      return;
    }

    if (this.isFile) {
      this.fileService.saveFile();
      return;
    }

    this.codeSystemService.save(this.codeSystem)
      .subscribe((codeSystem: ICodeSystem) => {
        if (this.isNew) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.baseSessionUrl}/code-system/${codeSystem.id}`]);
        } else {
          this.recentItemService.ensureRecentItem(Globals.cookieKeys.recentCodeSystems, codeSystem.id, codeSystem.name);
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
        this.message = 'Your changes have been saved!';
      }, (err) => {
        this.message = 'An error occurred while saving the code system: ' + getErrorString(err);
      });
  }

  private getCodeSystemID(){
    return this.route.snapshot.paramMap.get('id');
  }

  private getCodeSystem() {
    const codeSystemId = this.getCodeSystemID();

    if (this.isFile) {
      if (this.fileService.file) {
        this.codeSystem = <ICodeSystem>this.fileService.file.resource;
        this.nameChanged();
        this.refreshConcepts();
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {
      this.codeSystem = null;

      this.codeSystemService.get(codeSystemId)
        .subscribe((cs) => {
          if (cs.resourceType !== 'CodeSystem') {
            this.message = 'The specified code system either does not exist or was deleted';
            return;
          }

          this.codeSystem = <ICodeSystem>cs;
          this.nameChanged();
          this.refreshConcepts();
          this.recentItemService.ensureRecentItem(
            Globals.cookieKeys.recentCodeSystems,
            this.codeSystem.id,
            this.codeSystem.name || this.codeSystem.title);
        }, (err) => {
          this.csNotFound = err.status === 404;
          this.message = getErrorString(err);
          this.recentItemService.removeRecentItem(Globals.cookieKeys.recentCodeSystems, codeSystemId);
        });
    }
  }

  nameChanged() {
    this.configService.setTitle(`CodeSystem - ${this.codeSystem.title || this.codeSystem.name || 'no-name'}`);
  }

  ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/code-system/')) {
        this.getCodeSystem();
      }
    });
    this.getCodeSystem();
  }

  ngOnDestroy() {
    this.navSubscription.unsubscribe();
    this.configService.setTitle(null);
  }

  ngDoCheck() {
    if (this.codeSystem) {
      this.validation = this.fhirService.validate(this.codeSystem);
    }
  }
}
