import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../shared/audit.service';
import { Paginated } from '@trifolia-fhir/tof-lib';
import { AuditAction, AuditEntityType, AuditEntityValue, IAudit, IAuditPropertyDiff, IUser } from '@trifolia-fhir/models';
import { Subject, debounceTime } from 'rxjs';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  public hoveredDate: NgbDate | null = null; 


  constructor(
    private auditService: AuditService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private formatter: NgbDateParserFormatter
    ) { }

  ngOnInit(): void {

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getAudits();
      });

      this.getAudits();

  }

  private _fromDate: NgbDate | null;
  public get fromDate(): NgbDate | null {
    return this._fromDate;
  }
  public set fromDate(value: NgbDate | null) {
    this._fromDate = value;
    if (value) {
      this.criteria.timestampStart = new Date(Date.UTC(value.year, value.month-1, value.day, 0, 0, 0)).toISOString();
    } else {
      delete this.criteria.timestampStart;
    }   
    this.criteriaChangedEvent.next();
  }

  private _toDate: NgbDate | null;
  public get toDate(): NgbDate | null {
    return this._toDate;
  }
  public set toDate(value: NgbDate | null) {
    this._toDate = value;
    if (value) {
      this.criteria.timestampEnd = new Date(Date.UTC(value.year, value.month-1, value.day+1, 0, 0, 0)).toISOString();
    } else {
      delete this.criteria.timestampEnd;
    }    
    this.criteriaChangedEvent.next();
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


  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
      delete this.criteria.toDate;
			this.fromDate = date;
		}
	}

  isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

  validateDateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

}
