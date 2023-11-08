import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../shared/audit.service';
import { Paginated } from '@trifolia-fhir/tof-lib';
import { AuditEntityValue, IAudit, IAuditPropertyDiff, IUser } from '@trifolia-fhir/models';
import { Subject, debounceTime } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trifolia-fhir-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  public criteriaChangedEvent = new Subject<void>();
  public audits: Paginated<IAudit>;
  public currentPage: number = 1;

  public currentAudit: IAudit;
  public currentEntity: AuditEntityValue;
  public currentUser: IUser;
  public currentPropertyDiffs: IAuditPropertyDiff[]


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
    this.auditService.search(this.currentPage).subscribe({
      next: (results) => {
        this.audits = results;
      },
      error: (err) => {console.log(err);}
    });
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
