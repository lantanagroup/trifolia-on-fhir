import { IReportFilter, ReportFieldType, ReportFilterType } from "@trifolia-fhir/models";
import { AuditReport } from "../audit-report";
import { PipelineStage } from "mongoose";


export class UserSummaryReport extends AuditReport {

  public id = 'user-summary';
  public name = 'User Activity Summary';
  public title = 'User Activity Summary';
  public defaultSort = '-actions';

  public fields = [
    { path: 'userName', label: 'User Name', type: ReportFieldType.String, order: 1 },
    { path: 'email', label: 'Email', type: ReportFieldType.String, order: 2},
    { path: 'login', label: 'Logins', type: ReportFieldType.Number, order: 3},
    { path: 'created', label: 'Created', type: ReportFieldType.Number, order: 10 },
    { path: 'read', label: 'Read', type: ReportFieldType.Number, order: 4 },
    { path: 'updated', label: 'Updated', type: ReportFieldType.Number, order: 5 },
    { path: 'deleted', label: 'Deleted', type: ReportFieldType.Number, order: 6 },
    { path: 'publishSuccess', label: 'Publish Success', type: ReportFieldType.Number, order: 7 },
    { path: 'publishFailure', label: 'Publish Failure', type: ReportFieldType.Number, order: 8 },
    { path: 'actions', label: 'Actions', type: ReportFieldType.Number, hidden: false }
  ];

  public filters: IReportFilter[] = [
    { id: 'timestamp', label: 'Date Range', type: ReportFilterType.DateRange },
    { id: 'userName', label: 'User Name', type: ReportFilterType.Text },
    { id: 'email', label: 'Email', type: ReportFilterType.Text },
  ];


  protected getPipeline(filters: { [key: string]: any; }): PipelineStage[] {

    const pipeline: PipelineStage[] = [];

    pipeline.push(
      {
        $match: {
          user: { $exists: true }
        },
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
          user: 1,
          timestamp: 1,
          userName: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          email: { $concat: ["$user.email"]},
          create: { $cond: [{ $eq: ['$action', 'create'] }, 1, 0] },
          updates: { $cond: [{ $eq: ['$action', 'update'] }, 1, 0] },
          reads: { $cond: [{ $eq: ['$action', 'read'] }, 1, 0] },
          delete: { $cond: [{ $eq: ['$action', 'delete'] }, 1, 0] },
          publishSuccess: { $cond: [{ $eq: ['$action', 'publish-success'] }, 1, 0] },
          publishFailure: { $cond: [{ $eq: ['$action', 'publish-failure'] }, 1, 0] },
          logins: { $cond: [{ $eq: ["$action", "login"]}, 1, 0]}
        }
      },
      {
        $match: this.getMatchClause(filters)
      },
      {
        $group:
          {
            _id: '$user._id',
            user: { $first: "$user"},
            userName: { $addToSet: '$userName' },
            email : {$addToSet: '$email' } ,
            created: { $sum: '$create' },
            read: { $sum: '$reads' },
            updated: { $sum: '$updates' },
            deleted: { $sum: '$delete' },
            publishSuccess: { $sum: '$publishSuccess' },
            publishFailure: { $sum: '$publishFailure' },
            login: { $sum: "$logins"},
            actions: { $count: {} }
          }
      },
      {
        $unset: ['_id']
      },
      {
        $set: {
          username: { $first: '$username' },
          email: {$first: "$email"}
        }
      }
    );

    return pipeline;
    
  }
  
}