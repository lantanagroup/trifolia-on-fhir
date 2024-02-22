import { AuditReport } from "../audit-report";
import { IReportFilter, ReportFieldType, ReportFilterType } from "@trifolia-fhir/models";
import { PipelineStage } from "mongoose";


export class ImplementationGuideSummaryReport extends AuditReport {
  public id = 'ig-summary';
  public name = 'IG Summary';
  public title = 'Implementation Guide Summary';
  public defaultSort = '-actions';

  public fields = [
    { path: 'name', label: 'Name', type: ReportFieldType.String, order: 1 },
    { path: 'created', label: 'Created', type: ReportFieldType.Number, order: 8 },
    { path: 'read', label: 'Read', type: ReportFieldType.Number, order: 3 },
    { path: 'updated', label: 'Updated', type: ReportFieldType.Number, order: 4 },
    { path: 'deleted', label: 'Deleted', type: ReportFieldType.Number, order: 5 },
    { path: 'publishSuccess', label: 'Publish Success', type: ReportFieldType.Number, order: 6 },
    { path: 'publishFailure', label: 'Publish Failure', type: ReportFieldType.Number, order: 7 },
    { path: 'users', label: 'Users', type: ReportFieldType.String, order: 2 },
    { path: 'actions', label: 'Actions', type: ReportFieldType.Number, hidden: true }
  ];

  public filters: IReportFilter[] = [
    { id: 'timestamp', label: 'Date Range', type: ReportFilterType.DateRange },
    { id: 'igName', label: 'IG Name', path: 'fhirResource.resource.name', type: ReportFilterType.Text },
  ];


  protected getPipeline(filters: { [key: string]: any; }): PipelineStage[] {

    const pipeline: PipelineStage[] = [];

    pipeline.push(
      {
        $lookup: {
          from: 'fhirResource',
          localField: 'entityValue',
          foreignField: '_id',
          as: 'fhirResource'
        }
      },
      {
        $set: {
          fhirResource: {
            $first: '$fhirResource'
          }
        }
      },
      {
        $match: {
          fhirResource: { $exists: true },
          'fhirResource.resource.resourceType': 'ImplementationGuide'
        }
      },
      {
        $lookup: {
          from: 'user',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $set: {
          user: {
            $first: '$user'
          }
        }
      },
      {
        $match: this.getMatchClause(filters)
      },
      {
        $project: {
          fhirResource: 1,
          userName: { $concat: ["$user.firstName", " ", "$user.lastName"]},
          create: { $cond: [{ $eq: ['$action', 'create'] }, 1, 0] },
          updates: { $cond: [{ $eq: ['$action', 'update'] }, 1, 0] },
          reads: { $cond: [{ $eq: ['$action', 'read'] }, 1, 0] },
          delete: { $cond: [{ $eq: ['$action', 'delete'] }, 1, 0] },
          publishSuccess: { $cond: [{ $eq: ['$action', 'publish-success'] }, 1, 0] },
          publishFailure: { $cond: [{ $eq: ['$action', 'publish-failure'] }, 1, 0] }
        }
      },
      {
        $group:
          {
            _id: '$fhirResource._id',
            name: { $first: '$fhirResource.resource.name' },
            created: { $sum: '$create' },
            read: { $sum: '$reads' },
            updated: { $sum: '$updates' },
            deleted: { $sum: '$delete' },
            publishSuccess: { $sum: '$publishSuccess' },
            publishFailure: { $sum: '$publishFailure' },
            actions: { $count: {} },
            users: { $addToSet : "$userName"}
          }
      },
      {
        $unset: ['_id']
      }
    );

    return pipeline;
  }

}