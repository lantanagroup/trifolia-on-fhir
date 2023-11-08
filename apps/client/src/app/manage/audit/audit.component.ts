import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../shared/audit.service';
import { Paginated } from '@trifolia-fhir/tof-lib';
import { AuditAction, AuditEntityType, AuditEntityValue, IAudit, IAuditPropertyDiff, IUser } from '@trifolia-fhir/models';
import { Subject, debounceTime } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trifolia-fhir-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  public AuditAction = AuditAction;
  public AuditEntityType = AuditEntityType;

  public currentAudit: IAudit;
  public currentEntity: AuditEntityValue;
  public currentUser: IUser;
  public currentPropertyDiffs: IAuditPropertyDiff[]

  public actions = Object.values(AuditAction).sort();
  public entityTypes = Object.values(AuditEntityType).sort();

  public criteriaChangedEvent = new Subject<void>();
  public audits: Paginated<IAudit> = {
    results: [],
    itemsPerPage: 25,
    total: 0
  };
  public currentPage: number = 1;
  public criteria: {[key: string]: string} = {};
  public sort: string = '-timestamp';
  public itemsPerPage: number = 25;
  public loadingResults: boolean = false;


  constructor(
    private auditService: AuditService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getAudits();
      });

      this.getAudits();

  }


  public async getAudits() {
    this.loadingResults = true;
    this.audits.results = [];
    this.audits.total = 0;
    
    this.auditService.search(this.currentPage, this.itemsPerPage, this.sort, this.criteria).subscribe({
      next: (results) => {
        this.audits = results;
      },
      error: (err) => {console.log(err);},
      complete: () => {this.loadingResults = false;}
    });
  }


  public changeSort(column: string) {
    const currentColumn = this.sort.startsWith('-') ? this.sort.substring(1) : this.sort;
    if (currentColumn === column) {
      this.sort = this.sort.startsWith('-') ? column : `-${column}`;
    } else {
      this.sort = column;
    }
    this.currentPage = 1;
    this.getAudits();
  }

  public getSortIcon(column: string) {
    const currentColumn = this.sort.startsWith('-') ? this.sort.substring(1) : this.sort;
    if (currentColumn === column) {
      return this.sort.startsWith('-') ? 'fa fa-sort-down' : 'fa fa-sort-up';
    }
    return 'fa fa-sort';
  }


  copyToClipboard(data: any) {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }

  openAuditModal(modal: any, audit: IAudit) {
    this.currentAudit = audit;
    this.modalService.open(modal, { size: 'xl', scrollable: true }).closed.subscribe(() => {
      this.currentAudit = null;
    });
  }


  openEntityModal(modal: any, entity: AuditEntityValue) {
    this.currentEntity = entity;
    this.modalService.open(modal, { size: 'xl', scrollable: true }).closed.subscribe(() => {
      this.currentEntity = null;
    });
  }


  openUserModal(modal: any, user: IUser) {
    this.currentUser = user;
    this.modalService.open(modal, { size: 'xl', scrollable: true }).closed.subscribe(() => {
      this.currentUser = null;
    });
  }


  openDiffsModal(modal: any, diffs: IAuditPropertyDiff[]) {
    this.currentPropertyDiffs = diffs;
    this.modalService.open(modal, { size: 'xl', scrollable: true }).closed.subscribe(() => {
      this.currentPropertyDiffs = null;
    });

  }

}
