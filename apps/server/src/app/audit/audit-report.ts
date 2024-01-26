import { IReport, IReportField, IReportFilter, ReportFilterType } from "@trifolia-fhir/models";
import { AuditService } from "./audit.service";
import { PipelineStage } from "mongoose";
import { PaginateOptions, Paginated } from "@trifolia-fhir/tof-lib";


// Base class for all audit reports
export class AuditReport implements IReport {  

  id: string;
  name: string;
  title?: string;
  fields: IReportField[];
  filters: IReportFilter[];
  defaultSort?: string;

  constructor(private auditService: AuditService) {
  }  

  public async getResults(options: PaginateOptions, filters: {[key: string]: any}): Promise<Paginated<any>> {

    const page = (options && options.page) ? options.page*1 : 1;
    const limit = (options && options.itemsPerPage) ? options.itemsPerPage*1 : 25;
    const skip = (page-1) * limit;
    const sortBy = (options && options.sortBy)  ? options.sortBy : {};

    const pipeline = this.getPipeline(filters);

    let query = this.auditService.getModel().aggregate(pipeline);
    if (Object.keys(sortBy).length > 0) {
      query = query.sort(sortBy);
    }
    query = query.skip(skip).limit(limit);

    const totalRes = await this.auditService.getModel().aggregate(pipeline).count('total');
    const total = (totalRes && totalRes.length > 0) ? totalRes[0]['total'] : 0;

    const result: Paginated<any> = {
      total: total,
      itemsPerPage: limit,
      results: (await query || [])
    };

    return result;
  }


  protected getPipeline(filters: {[key: string]: any}): PipelineStage[] {
    return [];
  }

  protected getMatchClause(filters: {[key: string]: any}): { [key:string]: any } {

    const toMatch = {};

    (this.filters || []).forEach(filter => {

      const path = filter.path || filter.id;

      if (filter.type === ReportFilterType.Text) {
        if (!!filters[filter.id]) {
          toMatch[path] = { $regex: this.escapeRegExp(filters[filter.id]), $options: 'i' };
        }
      }

      else if (filter.type === ReportFilterType.Number || filter.type === ReportFilterType.Select) {
        if (!!filters[filter.id]) {
          toMatch[path] = filters[filter.id];
        }
      }

      else if (filter.type === ReportFilterType.Date) {
        if (!!filters[filter.id]) {
          const startDate = new Date(filters[filter.id]);
          toMatch[path]['$gte'] = startDate;
          startDate.setDate(startDate.getDate() + 1);
          toMatch[path]['$lte'] = startDate;
        }
      }

      else if (filter.type === ReportFilterType.DateRange) {
        const dateRange = this.getDateRange(filter.id, filters);
        if (dateRange) {
          toMatch[path] = dateRange;
        }
      }


    });

    return toMatch;
  }


  protected getDateRange(fieldId: string, filters: { [key: string]: any; }): { [key: string]: Date } | null {
    let newFilter;

    if (!!filters[fieldId+'Start'] || !!filters[fieldId+'End']) {
      newFilter = {};
      if (!!filters[fieldId+'Start']) {
        newFilter['$gte'] = new Date(filters[fieldId+'Start']);
      }
      if (!!filters['timestampEnd']) {
        newFilter['$lte'] = new Date(filters[fieldId+'End']);
      }
    }

    return newFilter;
  }

  protected escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
  
}