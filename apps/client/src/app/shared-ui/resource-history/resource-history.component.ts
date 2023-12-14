import {AfterContentChecked, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {type IDomainResource, getErrorString, Paginated} from '@trifolia-fhir/tof-lib';
import {AuditAction, IAuditPropertyDiff, type IAudit, type IFhirResource, type IHistory, type INonFhirResource} from '@trifolia-fhir/models';
import {HistoryService} from '../../shared/history.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { AuditService } from '../../shared/audit.service';
import { AuditDiffsModalComponent } from '../audit-diffs-modal/audit-diffs-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RawModalComponent } from '../raw-modal/raw-modal.component';
import { ConfigService } from '../../shared/config.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-resource-history',
  templateUrl: './resource-history.component.html',
  styleUrls: ['./resource-history.component.css']
})
export class ResourceHistoryComponent implements OnInit, AfterContentChecked {
  @Input() public resource: IFhirResource | INonFhirResource;
  @Output() public resourceChange = new EventEmitter<any>();
  @Output() public change: EventEmitter<void> = new EventEmitter<void>();

  public historyResults: Paginated<IHistory>;
  public message: string;
  public leftResource: any;
  public rightResource: any;
  public isLeftResource = false;
  public domainResource: IDomainResource;
  public currentVersion: number;
  public historyCurrentPage = 1;

  public AuditAction = AuditAction;
  public auditResults: Paginated<IAudit>;
  public auditCurrentPage = 1;
  public auditItemsPerPage = 10;
  
  public initialized = false;

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private auditService: AuditService,
    private modalService: NgbModal
    ) {
  }

  public getActionDisplay(entry: IHistory) {
    if (!entry || !entry.versionId ) {
      return 'Unknown';
    }
    if(entry.versionId == 1){
      return 'Create';
    }
    else{
      return 'Update';
    }
  }

  public get isAdmin(): boolean {
    return this.authService.userProfile.isAdmin;
  }


  public loadHistory(resource1: any, resource2: any, isLeft: boolean) {
    if (!confirm('Loading the history will overwrite any changes you have made to the resource that are not saved. Save to confirm reverting to the selected historical item. Are you sure want to continue?')) {
      return;
    }

    if (isLeft === true) {
      this.leftResource = resource1;
      this.rightResource = resource2;
      this.message = `Done loading left resource`;
    } else {
      this.rightResource = resource1;
      this.leftResource = resource2;
      this.message = `Done loading right resource`;
    }

    this.resourceChange.emit(resource1.content);
    this.domainResource = resource1.content;
    this.change.emit();
  }

  public async getHistory() {
    if (this.resource  && this.resource.id) {
      let resourceType = "";
      try {
        if(this.resource.hasOwnProperty("resource")){
          let res =  <IFhirResource>this.resource;
          this.domainResource = res.resource;
          resourceType = "FhirResource";
        }
        else {//if(this.resource.hasOwnProperty("content")){
          let res =  <INonFhirResource>this.resource;
          this.domainResource = res.content;
          resourceType = "NonFhirResource";
        }


        this.historyResults = await firstValueFrom(this.historyService.getHistory(resourceType, this.resource.id, this.historyCurrentPage));

      } catch (ex) {
        this.message = getErrorString(ex);
      }
    }
  }

  private _leftVersionId: number;
  public get leftVersionId(): number {
    return this._leftVersionId;
  }
  public set leftVersionId(value: number) {
    this._leftVersionId = value;
    this.leftResource = this.getVersion(value);
  }

  private _rightVersionId: number;
  public get rightVersionId(): number {
    return this._rightVersionId;
  }
  public set rightVersionId(value: number) {
    this._rightVersionId = value;
    this.rightResource = this.getVersion(value);
  }

  public getVersion(versionId: number) {
    return this.historyResults.results.find(e => e.versionId === versionId);
  }


  private async refreshHistory() {

    this.currentVersion = this.resource.versionId;
    await this.getHistory();

    if (this.historyResults && this.historyResults.results.length > 1) {
      this.leftVersionId = this.historyResults.results[0]?.versionId;
      this.rightVersionId = this.historyResults.results[1]?.versionId;
    }
  }

  openRawModal(data: any, title: string) {
    const modalRef = this.modalService.open(RawModalComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.title = title;
  }

  openAuditDiffsModal(diffs: IAuditPropertyDiff[]) {
    const modalRef = this.modalService.open(AuditDiffsModalComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.propertyDiffs = diffs;
  }


  public async getAudits() {

    if (this.resource && this.resource.id) {
      const type: 'nonFhirResource' | 'fhirResource' = this.resource.hasOwnProperty("resource") ? 'fhirResource' : 'nonFhirResource';
      this.auditResults = await firstValueFrom(this.auditService.getResourceAudits(type, this.resource.id, this.auditCurrentPage, this.auditItemsPerPage));
    }

  }

  private async refreshAudits() {
    await this.getAudits();
  }


  private async refresh() {
    await forkJoin([this.refreshHistory(), this.refreshAudits()]);
  }


  async ngAfterContentChecked() {
    if (this.initialized && this.resource.versionId !== this.currentVersion) {
      await this.refresh();
    }
  }

  async ngOnInit() {

    this.refresh().then(() => {
      this.initialized = true;
    });

  }
}
