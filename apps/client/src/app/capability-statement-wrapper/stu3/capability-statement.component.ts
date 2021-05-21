import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { CapabilityStatementService } from '../../shared/capability-statement.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CapabilityStatement, Coding, EventComponent, ResourceComponent, RestComponent } from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';
import { RecentItemService } from '../../shared/recent-item.service';
import { FhirService } from '../../shared/fhir.service';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FhirCapabilityStatementResourceModalComponent } from '../../fhir-edit/capability-statement-resource-modal/capability-statement-resource-modal.component';
import { FhirMessagingEventModalComponent } from '../../fhir-edit/messaging-event-modal/messaging-event-modal.component';
import { FhirReferenceModalComponent } from '../../fhir-edit/reference-modal/reference-modal.component';
import { ConfigService } from '../../shared/config.service';
import { FileService } from '../../shared/file.service';
import { ClientHelper } from '../../clientHelper';
import { AuthService } from '../../shared/auth.service';
import { getErrorString } from '../../../../../../libs/tof-lib/src/lib/helper';
import { BaseComponent } from '../../base.component';

@Component({
  templateUrl: './capability-statement.component.html',
  styleUrls: ['./capability-statement.component.css']
})
export class STU3CapabilityStatementComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  @Input() public capabilityStatement: CapabilityStatement;

  public message: string;
  public validation: any;
  public messageEventCodes: Coding[] = [];
  public messageTransportCodes: Coding[] = [];
  public csNotFound = false;
  public Globals = Globals;
  public ClientHelper = ClientHelper;
  public codes: Coding[] = [];

  private navSubscription: any;

  constructor(
    public fhirService: FhirService,
    public fileService: FileService,
    public route: ActivatedRoute,
    protected authService: AuthService,
    private modalService: NgbModal,
    private csService: CapabilityStatementService,
    public configService: ConfigService,
    private router: Router,
    private recentItemService: RecentItemService) {

    super(configService, authService);

    this.capabilityStatement = new CapabilityStatement({ meta: this.authService.getDefaultMeta() });
  }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('id');
    return !id || id === 'new';
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('id') === 'from-file';
  }

  getCodes(list: any, resourceIndex) {
    if (list != null) {
      const remainingCodes = [];
      this.codes.forEach((coding) => {
        const listIndex = list.findIndex((element) => {
          if (element.type === coding.code) {
            return true;
          }
        });
        if (listIndex === resourceIndex || listIndex === -1) remainingCodes.push(coding);
      });
      return remainingCodes;
    }
  }

  public defaultResource(list: any) {
    if (list != null) {
      const remainingCodes = [];
      this.codes.forEach((coding) => {
        const foundCode = list.find((elem) => elem.type === coding.code);
        if (foundCode === undefined) {
          remainingCodes.push(coding);
          return;
        }
      });
      list.push({ type: remainingCodes[0].code });
    }
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

  public moveRestLeft(rest: RestComponent, tabSet: NgbTabset) {
    const currentIndex = this.capabilityStatement.rest.indexOf(rest);

    if (currentIndex > 0) {
      this.capabilityStatement.rest.splice(currentIndex, 1);
      this.capabilityStatement.rest.splice(currentIndex - 1, 0, rest);
      setTimeout(() => tabSet.activeId = 'rest-' + (currentIndex - 1));
    }
  }

  public moveRestRight(rest: RestComponent, tabSet: NgbTabset) {
    const currentIndex = this.capabilityStatement.rest.indexOf(rest);

    if (currentIndex < this.capabilityStatement.rest.length) {
      this.capabilityStatement.rest.splice(currentIndex, 1);
      this.capabilityStatement.rest.splice(currentIndex + 1, 0, rest);
      setTimeout(() => tabSet.activeId = 'rest-' + (currentIndex + 1));
    }
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

  public editResource(resource: ResourceComponent) {
    const modalRef = this.modalService.open(FhirCapabilityStatementResourceModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resource = resource;
  }

  public copyResource(rest: RestComponent, resource: ResourceComponent) {
    const resourceCopy = JSON.parse(JSON.stringify(resource));
    rest.resource.push(resourceCopy);
  }

  public getDefaultMessagingEvent(): EventComponent {
    return {
      code: this.messageEventCodes[0],
      mode: 'sender',
      focus: 'Account',
      request: { reference: '', display: '' },
      response: { reference: '', display: '' }
    };
  }

  public editEvent(event: EventComponent) {
    const modalRef = this.modalService.open(FhirMessagingEventModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = event;
  }

  public selectImplementationGuide(implementationGuideIndex) {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resourceType = 'ImplementationGuide';
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((results: any) => {
      this.capabilityStatement.implementationGuide[implementationGuideIndex] = results.resource.url || results.fullUrl;
    });
  }

  public addRestEntry(restTabSet) {
    this.capabilityStatement.rest.push({ mode: 'client' });
    setTimeout(() => {
      const lastIndex = this.capabilityStatement.rest.length - 1;
      const newRestTabId = 'rest-' + lastIndex.toString();
      restTabSet.select(newRestTabId);
    }, 50);
  }

  public beforeRestTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'add') {
      $event.preventDefault();
    }
  }

  public addMessagingEntry(messagingTabSet) {
    this.capabilityStatement.messaging.push({});
    setTimeout(() => {
      const lastIndex = this.capabilityStatement.messaging.length - 1;
      const newMessagingTabId = 'messaging-' + lastIndex.toString();
      messagingTabSet.select(newMessagingTabId);
    }, 50);
  }

  nameChanged() {
    this.configService.setTitle(`CapabilityStatement - ${this.capabilityStatement.title || this.capabilityStatement.name || 'no-name'}`);
  }

  ngOnInit() {
    this.messageTransportCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-transport');
    this.messageEventCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-events');
    this.codes =  this.codes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
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

  private getCapabilityStatement() {
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
}
