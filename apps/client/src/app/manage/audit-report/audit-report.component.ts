import { Component, OnInit } from "@angular/core";
import { IReportMetadata as IReportDefinition, IReportField, ReportFieldType, ReportFilterType } from "@trifolia-fhir/models";
import { AuditService } from "../../shared/audit.service";
import { Paginated } from "@trifolia-fhir/tof-lib";
import { Subject, debounceTime } from "rxjs";
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'trifolia-fhir-audit-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.css']
})
export class AuditReportComponent implements OnInit {

  public ReportFieldType = ReportFieldType;
  public ReportFilterType = ReportFilterType;

  public reportList: IReportDefinition[] = [];
  public selectedReportId: string;
  public selectedReport: IReportDefinition;
  public criteriaChangedEvent = new Subject<void>();
  public reportData: Paginated<any> = {
    results: [],
    itemsPerPage: 25,
    total: 0
  }
  public currentPage: number = 1;
  public criteria: {[key: string]: string} = {};
  public sort: string = '-timestamp';
  public itemsPerPage: number = 25;
  public loadingResults: boolean = false;

  constructor(
    private auditService: AuditService,
    private calendar: NgbCalendar,
    private formatter: NgbDateParserFormatter
    ) {}

  ngOnInit(): void {
    this.auditService.getReportList().subscribe((reports) => {
      this.reportList = reports;
    });

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.currentPage = 1;
        this.getReportData();
      });
  }


  reportSelectionChanged(selectedReportId: string) {

    this.criteria = {};
    this.currentPage = 1;
    this.ngbDates = {};
    this.reportData = {
      results: [],
      itemsPerPage: 25,
      total: 0
    };

    if (!selectedReportId) {
      this.selectedReport = null;
      return;
    }

    this.selectedReport = this.reportList.find((report) => report.id === selectedReportId);

    if (!this.selectedReport) {
      console.error(`Could not find report with id ${selectedReportId}`);
      return;
    }

    this.sort = this.selectedReport.defaultSort || '-timestamp';

    this.getReportData();

  }

  get tableFields() : IReportField[] {
    let fields = this.selectedReport?.fields.filter(r => !r.hidden).sort((a, b) => !!a.order ? a.order - b.order : 9000);
    return fields || [];
  }

  get columnCount() : number {
    return this.tableFields.length;
  }
  

  public async getReportData() {
    this.loadingResults = true;
    this.reportData.results = [];
    this.reportData.total = 0;

    this.auditService.getReport(this.selectedReport.id, this.currentPage, this.itemsPerPage, this.sort, this.criteria).subscribe({
      next: (results) => {
        this.reportData = results;
      }, 
      error: (err) => { console.error(err); },
      complete: () => { this.loadingResults = false; }
    });
  }

  public getValue(data: any, path: string) {
    if (!data) {
      return null;
    }

    let value = data;
    const pathParts = path.split('.');
    for (let i = 0; i < pathParts.length; i++) {
      const pathPart = pathParts[i];
      value = value[pathPart];
    }

    return value;
  }

  public changeSort(column: string) {
    const currentColumn = this.sort.startsWith('-') ? this.sort.substring(1) : this.sort;
    if (currentColumn === column) {
      this.sort = this.sort.startsWith('-') ? column : `-${column}`;
    } else {
      this.sort = column;
    }
    this.currentPage = 1;
    this.getReportData();
  }

  public getSortIcon(column: string) {
    const currentColumn = this.sort.startsWith('-') ? this.sort.substring(1) : this.sort;
    if (currentColumn === column) {
      return this.sort.startsWith('-') ? 'fa fa-sort-down' : 'fa fa-sort-up';
    }
    return 'fa fa-sort';
  }



  setFilter(filterId: string, value: any) {
    let existing = this.criteria[filterId];
    if (value) {
      this.criteria[filterId] = value;
    } else {
      delete this.criteria[filterId];
    }

    if (existing !== this.criteria[filterId]) {
      this.criteriaChangedEvent.next();
    }
  }



  //
  // Date picker related
  //

  private _ngbDates: {[key:string]: NgbDate } = {};
  public get ngbDates(): {[key:string]: NgbDate | null } {
    return this._ngbDates;
  }
  public set ngbDates(value: {[key:string]: NgbDate | null }) {
    this._ngbDates = value;
    Object.keys(this._ngbDates).filter(key => !key.endsWith('Hovered')).forEach(key => {
      if (this._ngbDates[key]) {
        this.criteria[key] = new Date(Date.UTC(this._ngbDates[key].year, this._ngbDates[key].month-1, this._ngbDates[key].day, 0, 0, 0)).toISOString();
      } else {
        delete this.criteria[key];
      }
    });
    this.criteriaChangedEvent.next();
  }

  setDate(filterId: string, date: NgbDate | null) {
    let existingDate = this.criteria[filterId];
    this.ngbDates[filterId] = date;
    if (date) {
      let newDate = new Date(Date.UTC(date.year, date.month-1, date.day, 0, 0, 0));
      if (filterId.endsWith('End')) {
        newDate.setDate(newDate.getDate() + 1);
      }
      this.criteria[filterId] = newDate.toISOString();
    } else {
      delete this.criteria[filterId];
    }

    if (existingDate !== this.criteria[filterId]) {
      this.criteriaChangedEvent.next();
    }
  }

  onDateSelection(filterId: string, date: NgbDate) {
		if (!this.ngbDates[filterId+'Start'] && !this.ngbDates[filterId+'End']) {
      this.setDate(filterId+'Start', date);
		} else if (this.ngbDates[filterId+'Start'] && !this.ngbDates[filterId+'End'] && date && date.after(this.ngbDates[filterId+'Start'])) {
			this.setDate(filterId+'End', date);
		} else {
			this.setDate(filterId+'End', null);
      delete this.criteria[filterId+'End'];
			this.setDate(filterId+'Start', date);
		}
	}

  public hoveredDate: NgbDate | null = null;
  isHovered(filterId: string, date: NgbDate) {
		return (
			this.ngbDates[filterId+'Start'] && !this.ngbDates[filterId+'End'] && this.hoveredDate && date.after(this.ngbDates[filterId+'Start']) && date.before(this.hoveredDate)
		);
	}

	isInside(filterId: string, date: NgbDate) {
		return this.ngbDates[filterId+'End'] && date.after(this.ngbDates[filterId+'Start']) && date.before(this.ngbDates[filterId+'End']);
	}

	isRange(filterId: string, date: NgbDate) {
		return (
			date.equals(this.ngbDates[filterId+'Start']) ||
			(this.ngbDates[filterId+'End'] && date.equals(this.ngbDates[filterId+'End'])) ||
			this.isInside(filterId, date) ||
			this.isHovered(filterId, date)
		);
	}

  validateDateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
  
}