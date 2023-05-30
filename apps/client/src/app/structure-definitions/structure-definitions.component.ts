import {Component, OnInit} from '@angular/core';
import {StructureDefinitionService} from '../shared/structure-definition.service';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirService} from '../shared/fhir.service';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {CopyProfileModalComponent} from '../modals/copy-profile-modal/copy-profile-modal.component';
import {debounceTime} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './structure-definitions.component.html',
  styleUrls: ['./structure-definitions.component.css']
})
export class StructureDefinitionsComponent extends BaseComponent implements OnInit {
  public response;
  public structureDefinitionId: string;
  public message: string;
  public page = 1;
  public nameText: string;
  public IDText: string;
  public urlText: string;
  public typeText: string;
  public titleText: string;
  public criteriaChangedEvent = new Subject<void>();
  public implementationGuideId: string = null;
  public showMoreSearch = false;
  public Globals = Globals;
  public total: string;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private fhirService: FhirService,
    private implementationGuideService: ImplementationGuideService,
    private structureDefinitionService: StructureDefinitionService,
    private modalService: NgbModal,
    public route: ActivatedRoute) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getStructureDefinitions();
      });
  }

  public get structureDefinitions(): StructureDefinition[] {
    if (!this.response || !this.response.results) {
      return [];
    }

    return (this.response.results || []).map((entry) => {
      return <StructureDefinition>entry;
    });
  }

  public remove(structureDefinition: StructureDefinition) {
    if (!confirm(`Are you sure you want to delete the structure definition ${structureDefinition.name}`)) {
      return;
    }

    this.structureDefinitionService.delete(structureDefinition.id)
      .subscribe(() => {
        this.message = `Successfully deleted structure definition ${structureDefinition.name} (${structureDefinition.id})`;
        const entry = (this.response.results || []).find((e) => e.id === structureDefinition.id);
        const index = this.response.results.indexOf(entry);
        this.response.results.splice(index, index >= 0 ? 1 : 0);
        setTimeout(() => this.message = '', 3000);
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  public changeId(structureDefinitionListItem: StructureDefinition) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.resourceType = 'StructureDefinition';
    modalRef.componentInstance.originalId = structureDefinitionListItem.id;
    modalRef.result.then((newId) => {
      structureDefinitionListItem.id = newId;
    });
  }

  public copy(structureDefinitionID: string){
    const modalRef = this.modalService.open(CopyProfileModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.originalID = structureDefinitionID;
    modalRef.result.then((result) => {
      this.message = result ? result : `New profile that's a copy of the structure definition with id ${structureDefinitionID} has been made.`;
    });

  }

  public nameTextChanged(value: string) {
    this.nameText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public IDTextChanged(value: string) {
    this.IDText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public implementationGuideIdChanged(value: string) {
    this.implementationGuideId = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public urlTextChanged(value: string) {
    this.urlText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public typeTextChanged(value: string) {
    this.typeText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public titleTextChanged(value: string) {
    this.titleText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public toggleSearchOptions() {
    this.showMoreSearch = !this.showMoreSearch;

    if (!this.showMoreSearch && (this.titleText || this.urlText)) {
      this.titleText = null;
      this.urlText = null;
      this.criteriaChangedEvent.next();
    }
  }

  public clearFilters() {
    this.nameText = null;
    this.IDText = null;
    this.titleText = null;
    this.urlText = null;
    this.typeText = null;
    this.implementationGuideId = null;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public getStructureDefinitions() {
    this.response = null;
    this.configService.setStatusMessage('Loading structure definitions');

    this.implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    this.structureDefinitionService.getStructureDefinitions(this.page, this.nameText, this.IDText, this.urlText, this.implementationGuideId, this.titleText, this.typeText)
      .subscribe((response ) => {
        this.response = response;
        this.total = this.response.total;
        this.configService.setStatusMessage('');
      }, (err) => {
        this.configService.handleError(err, 'Error loading structure definitions.');
      });
  }

  public getContactDisplay(structureDefinition: StructureDefinition) {
    if (structureDefinition.contact && structureDefinition.contact.length > 0) {
      const contact = structureDefinition.contact[0];

      if (contact.name && contact.telecom && contact.telecom.length > 0) {
        return `${contact.name} (${contact.telecom[0].value})`;
      } else if (contact.name) {
        return contact.name;
      } else {
        return contact.telecom[0].value;
      }
    }
  }

  private initData() {
    this.getStructureDefinitions();
  }

  ngOnInit() {
    this.initData();
  }
}
