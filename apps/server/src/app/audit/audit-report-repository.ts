import { Injectable } from "@nestjs/common";
import { AuditReport } from "./audit-report";
import { AuditService } from "./audit.service";
import { ImplementationGuideSummaryReport } from "./reports/implementation-guide-summary-report";


@Injectable()
export class AuditReportRepository {

  public reports: AuditReport[] = [];
  
  constructor(private auditService: AuditService) {

    this.reports = [
      new ImplementationGuideSummaryReport(this.auditService)
    ];

  }

  public getReports(): AuditReport[] {
    return this.reports.sort((a, b) => a.title.localeCompare(b.title));
  }

  public getReport(id: string): AuditReport {
    return this.reports.find(r => r.id === id);
  }

}