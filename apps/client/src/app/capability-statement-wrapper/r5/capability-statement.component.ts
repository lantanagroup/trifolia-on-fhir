import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { CapabilityStatementService } from '../../shared/capability-statement.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  CapabilityStatement,
  CapabilityStatementRestResource,
  CapabilityStatementRest,
  Coding,
  StructureDefinition
} from '@trifolia-fhir/r5';
import { Globals } from '@trifolia-fhir/tof-lib';
import {firstValueFrom, Observable, Subject} from 'rxjs';
import { RecentItemService } from '../../shared/recent-item.service';
import { FhirService } from '../../shared/fhir.service';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { FhirCapabilityStatementResourceModalComponent } from '../../fhir-edit/capability-statement-resource-modal/capability-statement-resource-modal.component';
import { FileService } from '../../shared/file.service';
import { ConfigService } from '../../shared/config.service';
import { ClientHelper } from '../../clientHelper';
import { AuthService } from '../../shared/auth.service';
import { getErrorString } from '@trifolia-fhir/tof-lib';
import { FhirReferenceModalComponent, ResourceSelection } from '../../fhir-edit/reference-modal/reference-modal.component';
import { BaseComponent } from '../../base.component';
import { debounceTime } from 'rxjs/operators';
import {IConformance} from '@trifolia-fhir/models';
import {ImplementationGuide} from '@trifolia-fhir/stu3';
import {ImplementationGuideService} from '../../shared/implementation-guide.service';
import { IDomainResource } from '@trifolia-fhir/tof-lib';

@Component({
  templateUrl: './capability-statement.component.html',
  styleUrls: ['./capability-statement.component.css']
})
export class R5CapabilityStatementComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  @Input() public capabilityStatement;

  public conformance;
  public capabilityStatementId: string;

  public idChangedEvent = new Subject();
  public isIdUnique = true;
  public alreadyInUseIDMessage = '';

  public message: string;
  public validation: any;
  public messageEventCodes: Coding[] = [];
  public messageTransportCodes: Coding[] = [];
  public csNotFound = false;
  public Globals = Globals;
  public ClientHelper = ClientHelper;
  public codes: Coding[] = [];
  private navSubscription: any;
  public implementationGuide;

  constructor(
    public route: ActivatedRoute,
    protected authService: AuthService,
    public configService: ConfigService,
    private modal: NgbModal,
    private csService: CapabilityStatementService,
    private router: Router,
    private fileService: FileService,
    private recentItemService: RecentItemService,
    private fhirService: FhirService,
    private implementationGuideService: ImplementationGuideService) {

    super(configService, authService);

    this.capabilityStatement = new CapabilityStatement({ meta: this.authService.getDefaultMeta() });
    this.capabilityStatement.date = this.capabilityStatement.date?this.capabilityStatement.date.substring(0, this.capabilityStatement.date.indexOf("T") ) : "";
    this.conformance =  { resource: this.capabilityStatement, fhirVersion: <'stu3' | 'r4' | 'r5'>configService.fhirVersion, permissions: this.authService.getDefaultPermissions() };

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        const isIdUnique = await this.fhirService.checkUniqueId(this.capabilityStatement);
        if(!isIdUnique){
          this.isIdUnique = false;
          this.alreadyInUseIDMessage = "ID " +  this.capabilityStatement.id  + " is already used in this IG.";
        }
        else{
          this.isIdUnique = true;
          this.alreadyInUseIDMessage="";
        }
      });

  }


  getCodes(list: any, resourceIndex) {
    if(list != null) {
      const remainingCodes = [];
      this.codes.forEach((coding, index) => {
        const listIndex = list.findIndex((element) => {
          if (element.type === coding.code) {
            return true;
          }
        })
        if (listIndex === resourceIndex || listIndex === -1) remainingCodes.push(coding);
      });
      return remainingCodes;
    }
  }


  public defaultResource(list: any) {
    if(list != null) {
      const remainingCodes = [];
      this.codes.filter((coding, index) => { list.indexOf(coding.code)})
      const result = this.codes.filter(({ id }) => list.includes(id));

      this.codes.forEach((coding, index) => {
        const foundCode = list.find((elem) => elem.type === coding.code);
        if (foundCode === undefined) { remainingCodes.push(coding);return;}
      });
      list.push({ type: remainingCodes[0].code });
    }
  }

  addFormat() {
    this.capabilityStatement.format = this.capabilityStatement.format || [];
    this.capabilityStatement.format.push('');
  }

  addPatchFormat() {
    this.capabilityStatement.patchFormat = this.capabilityStatement.patchFormat || [];
    this.capabilityStatement.patchFormat.push('');
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



  public moveRestLeft(rest: CapabilityStatementRest, tabSet: NgbNav) {
    const currentIndex = this.capabilityStatement.rest.indexOf(rest);

    if (currentIndex > 0) {
      this.capabilityStatement.rest.splice(currentIndex, 1);
      this.capabilityStatement.rest.splice(currentIndex - 1, 0, rest);
      setTimeout(() => tabSet.activeId = 'rest-' + (currentIndex-1));
    }
  }

  public moveRestRight(rest: CapabilityStatementRest, tabSet: NgbNav) {
    const currentIndex = this.capabilityStatement.rest.indexOf(rest);

    if (currentIndex < this.capabilityStatement.rest.length) {
      this.capabilityStatement.rest.splice(currentIndex, 1);
      this.capabilityStatement.rest.splice(currentIndex + 1, 0, rest);
      setTimeout(() => tabSet.activeId = 'rest-' + (currentIndex+1));
    }
  }

  public moveResource(rest: CapabilityStatementRest, resource: CapabilityStatementRestResource, direction: 'up'|'down') {
    const index = rest.resource.indexOf(resource);

    if (direction === 'up') {
      if (index > 0) {
        rest.resource.splice(index, 1);
        rest.resource.splice(index - 1, 0, resource);
      }
    } else if (direction === 'down') {
      if (index < rest.resource.length - 1) {
        rest.resource.splice(index, 1);
        rest.resource.splice(index + 1, 0, resource);
      }
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

    this.csService.save(this.capabilityStatementId, this.conformance)
      .subscribe({
        next: (conf: IConformance) => {
          if (this.isNew) {
            // noinspection JSIgnoredPromiseFromCall
            this.capabilityStatementId = conf.id;
            this.router.navigate([`${this.configService.baseSessionUrl}/capability-statement/${conf.id}`]);
          } else {
            this.conformance = conf;
            this.loadCS(conf.resource);
            setTimeout(() => {
              this.message = '';
            }, 3000);
          }
          this.message = 'Your changes have been saved!';
          setTimeout(() => {
            this.message = '';
          }, 3000);
        },
        error: (err) => {
          this.message = 'An error occurred while saving the capability statement:' + getErrorString(err);
        }
      });
  }


  public editResource(resource: CapabilityStatementRestResource) {
    const modalRef = this.modal.open(FhirCapabilityStatementResourceModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.resource = resource;
  }

  public copyResource(rest: CapabilityStatementRest, resource: CapabilityStatementRestResource) {
    const resourceCopy: CapabilityStatementRestResource = JSON.parse(JSON.stringify(resource));
    rest.resource.push(resourceCopy);
  }

  public selectCanonical(property: string[], index: number){
    const modalRef = this.modal.open(FhirReferenceModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.resourceType = "CapabilityStatement";
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((results: ResourceSelection) => {
      property[index] = results.fullUrl;
    });
  }

  public selectResourceProfile(resource: CapabilityStatementRestResource) {
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

  private  getCapabilityStatement(): Observable<CapabilityStatement> {
    this.capabilityStatementId = this.route.snapshot.paramMap.get('id');
    if(this.implementationGuide.fhirVersion.length > 0) {
      this.conformance.resource.fhirVersion = this.implementationGuide.fhirVersion[0];
      this.capabilityStatement.fhirVersion = this.implementationGuide.fhirVersion[0];
    }
    if (this.isFile) {
      if (this.fileService.file) {
        this.loadCS(this.fileService.file.resource);
        this.nameChanged();
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {

      this.csService.get(this.capabilityStatementId)
        .subscribe({
          next: (conf) => {
            if (!conf || !conf.resource || conf.resource.resourceType !== 'CapabilityStatement') {
              this.message = 'The specified capability statement either does not exist or was deleted';
              return;
            }
            this.conformance = conf;
            this.loadCS(conf.resource);
          },
          error: (err) => {
            this.csNotFound = err.status === 404;
            this.message = getErrorString(err);
            this.recentItemService.removeRecentItem(Globals.cookieKeys.recentCapabilityStatements, this.capabilityStatementId);
          }
        });
    }
  }

  public get wrongDateFormat(){
    if(!this.capabilityStatement || !this.capabilityStatement.date) return false;
    const dateParts = this.capabilityStatement.date.toString().split('-');

    return dateParts.length > 1 && (dateParts.length !== 3 || dateParts[0].length < 4 || dateParts[1].length !== 2 || dateParts[2].length !== 2);
  }

  nameChanged() {
    this.configService.setTitle(`CapabilityStatement - ${this.capabilityStatement.title || this.capabilityStatement.name || 'no-name'}`);
  }

  loadCS(newVal: IDomainResource) {
    this.capabilityStatement = new CapabilityStatement(newVal);

    if (this.conformance) {
      this.conformance.resource = this.capabilityStatement;
    }

    this.nameChanged();
    this.recentItemService.ensureRecentItem(
      Globals.cookieKeys.recentCapabilityStatements,
      this.capabilityStatement.id,
      this.capabilityStatement.name || this.capabilityStatement.title);
  }

  async ngOnInit() {
    this.messageTransportCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-transport');
    this.codes =  this.codes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.messageEventCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-events');

    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    this.implementationGuide = <ImplementationGuide> (await firstValueFrom(this.implementationGuideService.getImplementationGuide(implementationGuideId))).resource;

    const url =  this.implementationGuide.url;
    if(!this.capabilityStatement.url) {
      this.capabilityStatement.url = url ? url.substr(0, url.indexOf("ImplementationGuide")) + "CapabilityStatement/" : "";
    }
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/capability-statement/')) {
        this.getCapabilityStatement();
      }
    });

    this.getCapabilityStatement();

  }

  ngOnDestroy() {
    if (this.navSubscription ) {
      this.navSubscription.unsubscribe();
    }
    this.configService.setTitle(null);
  }

  ngDoCheck() {
    if (this.capabilityStatement) {
      this.validation = this.fhirService.validate(this.capabilityStatement);
    }
  }
}
