import { IReportFilter, ReportFieldType, ReportFilterType } from "@trifolia-fhir/models";
import { AuditReport } from "../audit-report";
import { PipelineStage } from "mongoose";


export class FhirResourceSummaryReport extends AuditReport {

  public id = 'fhir-resource-summary';
  public name = 'FHIR Resources Summary';
  public title = 'FHIR Resources Summary';
  public defaultSort = '-actions';

  public fields = [
    { path: 'resourceType', label: 'Resource Type', type: ReportFieldType.String, order: 1 },
    { path: 'resourceId', label: 'Resource ID', type: ReportFieldType.String, order: 2 },
    { path: 'resourceName', label: 'Resource Name', type: ReportFieldType.String, order: 3 },
    { path: 'created', label: 'Created', type: ReportFieldType.Number, order: 10 },
    { path: 'read', label: 'Read', type: ReportFieldType.Number, order: 5 },
    { path: 'updated', label: 'Updated', type: ReportFieldType.Number, order: 6 },
    { path: 'deleted', label: 'Deleted', type: ReportFieldType.Number, order: 7 },
    { path: 'publishSuccess', label: 'Publish Success', type: ReportFieldType.Number, order: 8 },
    { path: 'publishFailure', label: 'Publish Failure', type: ReportFieldType.Number, order: 9 },
    { path: 'users', label: 'Users', type: ReportFieldType.String, order: 4 },
    { path: 'actions', label: 'Actions', type: ReportFieldType.Number, hidden: true }
  ];

  public filters: IReportFilter[] = [
    { id: 'timestamp', label: 'Date Range', type: ReportFilterType.DateRange },
    { id: 'resourceType', label: 'Resource Type', path: 'fhirResource.resource.resourceType', type: ReportFilterType.Text },
    { id: 'resourceId', label: 'Resource ID', path: 'fhirResource.resource.id', type: ReportFilterType.Text },
    { id: 'resourceName', label: 'Resource Name', type: ReportFilterType.Text },
    { id: 'userName', label: 'User Name', type: ReportFilterType.Text }
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
          'fhirResource.resource.resourceType': { $exists: true }
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
        $project: {
          fhirResource: 1,
          timestamp: 1,
          userName: { $concat: ["$user.firstName", " ", "$user.lastName"]},
          resourceName: this.getResourceNameProjection('$fhirResource.resource.name'),
          create: { $cond: [{ $eq: ['$action', 'create'] }, 1, 0] },
          updates: { $cond: [{ $eq: ['$action', 'update'] }, 1, 0] },
          reads: { $cond: [{ $eq: ['$action', 'read'] }, 1, 0] },
          delete: { $cond: [{ $eq: ['$action', 'delete'] }, 1, 0] },
          publishSuccess: { $cond: [{ $eq: ['$action', 'publish-success'] }, 1, 0] },
          publishFailure: { $cond: [{ $eq: ['$action', 'publish-failure'] }, 1, 0] }
        }
      },
      {
        $match: this.getMatchClause(filters)
      },
      {
        $group:
          {
            _id: '$fhirResource._id',
            resourceType: { $first: '$fhirResource.resource.resourceType' },
            resourceId: { $first: '$fhirResource.resource.id' },
            resourceName: { $first: '$resourceName' },
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