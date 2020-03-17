import {Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../../shared/capability-statement.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {
  CapabilityStatement,
  CapabilityStatementResourceComponent,
  CapabilityStatementRestComponent,
  Coding, StructureDefinition
} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {Observable} from 'rxjs';
import {RecentItemService} from '../../shared/recent-item.service';
import {FhirService} from '../../shared/fhir.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirCapabilityStatementResourceModalComponent} from '../../fhir-edit/capability-statement-resource-modal/capability-statement-resource-modal.component';
import {FileService} from '../../shared/file.service';
import {ConfigService} from '../../shared/config.service';
import {ClientHelper} from '../../clientHelper';
import {AuthService} from '../../shared/auth.service';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {
  FhirReferenceModalComponent,
  ResourceSelection
} from '../../fhir-edit/reference-modal/reference-modal.component';

@Component({
  templateUrl: './capability-statement.component.html',
  styleUrls: ['./capability-statement.component.css']
})
export class R4CapabilityStatementComponent implements OnInit, OnDestroy, DoCheck {
  @Input() public capabilityStatement: CapabilityStatement;

  public message: string;
  public validation: any;
  public messageEventCodes: Coding[] = [];
  public messageTransportCodes: Coding[] = [];
  public csNotFound = false;
  public Globals = Globals;
  public ClientHelper = ClientHelper;

  private navSubscription: any;

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService,
    private configService: ConfigService,
    private modal: NgbModal,
    private csService: CapabilityStatementService,
    private router: Router,
    private fileService: FileService,
    private recentItemService: RecentItemService,
    private fhirService: FhirService) {

    this.capabilityStatement = new CapabilityStatement({ meta: this.authService.getDefaultMeta() });
  }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('id');
    return !id || id === 'new';
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('id') === 'from-file';
  }

  public urlChanged() {
    const lastIndex = this.capabilityStatement.url.lastIndexOf('/');

    if (lastIndex > 0 && this.isNew) {
      this.capabilityStatement.id = this.capabilityStatement.url.substring(lastIndex + 1);
    }
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the capability statement?')) {
      return;
    }

    this.getCapabilityStatement();
  }

  public save() {
    if (!this.validation.valid && !confirm('This capability statement is not valid, are you sure you want to save?')) {
      return;
    }

    if (this.isFile) {
      this.fileService.saveFile();
      return;
    }

    this.csService.save(this.capabilityStatement)
      .subscribe((results: CapabilityStatement) => {
        if (this.isNew) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.baseSessionUrl}/capability-statement/${results.id}`]);
        } else {
          this.recentItemService.ensureRecentItem(Globals.cookieKeys.recentCapabilityStatements, results.id, results.name);
          this.message = 'Your changes have been saved!';
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      }, (err) => {
        this.message = `An error occurred while saving the capability statement: ${err.message}`;
      });
  }

  public editResource(resource: CapabilityStatementResourceComponent) {
    const modalRef = this.modal.open(FhirCapabilityStatementResourceModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.resource = resource;
  }

  public copyResource(rest: CapabilityStatementRestComponent, resource: CapabilityStatementResourceComponent) {
    const resourceCopy: CapabilityStatementResourceComponent = JSON.parse(JSON.stringify(resource));
    rest.resource.push(resourceCopy);
  }

  public selectResourceProfile(resource: CapabilityStatementResourceComponent) {
    const modalRef = this.modal.open(FhirReferenceModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resourceType = 'StructureDefinition';
    modalRef.componentInstance.hideResourceType = true;
    modalRef.result.then((selection: ResourceSelection) => {
      const structureDefinition = <StructureDefinition> selection.resource;
      resource.profile = structureDefinition.url;
    });
  }

  public addRestEntry(restTabSet) {
    this.capabilityStatement.rest.push({mode: 'client'});
    setTimeout(() => {
      const lastIndex = this.capabilityStatement.rest.length - 1;
      const newRestTabId = 'rest-' + lastIndex.toString();
      restTabSet.select(newRestTabId);
    }, 50);
  }

  public addMessagingEntry(messagingTabSet) {
    this.capabilityStatement.messaging.push({});
    setTimeout(() => {
      const lastIndex = this.capabilityStatement.messaging.length - 1;
      const newMessagingTabId = 'messaging-' + lastIndex.toString();
      messagingTabSet.select(newMessagingTabId);
    }, 50);
  }

  private getCapabilityStatement(): Observable<CapabilityStatement> {
    const capabilityStatementId = this.route.snapshot.paramMap.get('id');

    if (this.isFile) {
      if (this.fileService.file) {
        this.capabilityStatement = <CapabilityStatement>this.fileService.file.resource;
        this.nameChanged();
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {
      this.capabilityStatement = null;

      this.csService.get(capabilityStatementId)
        .subscribe((cs) => {
          if (cs.resourceType !== 'CapabilityStatement') {
            this.message = 'The specified capability statement either does not exist or was deleted';
            return;
          }

          this.capabilityStatement = <CapabilityStatement>cs;
          this.nameChanged();
          this.recentItemService.ensureRecentItem(
            Globals.cookieKeys.recentCapabilityStatements,
            this.capabilityStatement.id,
            this.capabilityStatement.name || this.capabilityStatement.title);
        }, (err) => {
          this.csNotFound = err.status === 404;
          this.message = getErrorString(err);
          this.recentItemService.removeRecentItem(Globals.cookieKeys.recentCapabilityStatements, capabilityStatementId);
        });
    }
  }

  nameChanged() {
    this.configService.setTitle(`CapabilityStatement - ${this.capabilityStatement.title || this.capabilityStatement.name || 'no-name'}`);
  }

  ngOnInit() {
    this.messageTransportCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-transport');
    this.messageEventCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-events');
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/capability-statement/')) {
        this.getCapabilityStatement();
      }
    });
    this.getCapabilityStatement();
  }

  ngOnDestroy() {
    this.navSubscription.unsubscribe();
    this.configService.setTitle(null);
  }

  ngDoCheck() {
    if (this.capabilityStatement) {
      this.validation = this.fhirService.validate(this.capabilityStatement);
    }
  }
}
