import {Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {BaseDataController} from '../base/base-data.controller';
import {AuditDocument} from './audit.schema';
import {type ITofUser, Paginated} from '@trifolia-fhir/tof-lib';
import {User} from '../server.decorators';
import {AuditService} from './audit.service';
import {IReportMetadata, type IAudit} from '@trifolia-fhir/models';
import {Request} from 'express';
import {ObjectId} from 'mongodb';
import { TofNotFoundException } from '../../not-found-exception';
import { AuditReportRepository } from './audit-report-repository';

@Controller('api/audits')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Audit')
@ApiOAuth2([])
export class AuditController extends BaseDataController<AuditDocument> {

  constructor(private auditService: AuditService, private auditReportRepository: AuditReportRepository) {
    super(auditService);
  }

  @Get('/fhirResources')
  public async searchAccessedFhirResources(@User() user: ITofUser, @Req() req?: any): Promise<Paginated<AuditDocument>> {

    this.assertAdmin(user);

    let options = this.getPaginateOptionsFromRequest(req);
    options.pipeline = [];

    options.pipeline.push(
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
      }
    );

    let filter = {};
    let filters = {};
    try {
      filters = JSON.parse(req.query?.filters);

      if (!!filters['timestampStart'] || !!filters['timestampEnd']) {
        if (!!filters['timestampStart'] && !!filters['timestampEnd']) {
          filter['timestamp'] = {
            $gte: new Date(filters['timestampStart']),
            $lte: new Date(filters['timestampEnd'])
          };
        } else if (!!filters['timestampStart'] && !filters['timestampEnd']) {
          let endDate = new Date(filters['timestampStart']);
          endDate.setDate(endDate.getDate() + 1);
          filter['timestamp'] = {
            $gte: new Date(filters['timestampStart']),
            $lte: endDate
          };
        }
      }
      if (!!filters['fhirResourceType']) {
        filter['fhirResource.resource.resourceType'] = { $regex: this.escapeRegExp(filters['fhirResourceType']), $options: 'i' };
      }
    } catch (error) {
    }

    options.pipeline.push({ $match: filter });
    options.pipeline.push(
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
            fhirResource: { $first: '$fhirResource' },
            Create: { $sum: '$create' },
            Reads: { $sum: '$reads' },
            Updates: { $sum: '$updates' },
            Delete: { $sum: '$delete' },
            PublishSuccess: { $sum: '$publishSuccess' },
            PublishFailure: { $sum: '$publishFailure' },
            Actions: { $count: {} },
            Users: { $addToSet : "$userName"}
          }
      },
      {
        $unset: ['_id']
      },
      {
        $sort: { Actions: -1 }
      }
    );
    options.hydrate = false;

    // console.log('options.pipeline', JSON.stringify(options.pipeline, null, 2));
    return this.dataService.search(options);

  }


  @Get()
  public async searchAudits(@User() user: ITofUser, @Req() req?: any): Promise<Paginated<AuditDocument>> {

    this.assertAdmin(user);

    let options = this.getPaginateOptionsFromRequest(req);
    options.pipeline = [];
    options.populate = ['entityValue'];

    options.pipeline.push(
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
      }
    );


    let filter = {};
    let filters = {};
    try {
      filters = JSON.parse(req.query?.filters);
      if (!!filters['action']) {
        filter['action'] = filters['action'];
      }
      if (!!filters['entityType']) {
        filter['entityType'] = filters['entityType'];
      }
      if (!!filters['timestampStart'] || !!filters['timestampEnd']) {
        if (!!filters['timestampStart'] && !!filters['timestampEnd']) {
          filter['timestamp'] = {
            $gte: new Date(filters['timestampStart']),
            $lte: new Date(filters['timestampEnd'])
          };
        } else if (!!filters['timestampStart'] && !filters['timestampEnd']) {
          let endDate = new Date(filters['timestampStart']);
          endDate.setDate(endDate.getDate() + 1);
          filter['timestamp'] = {
            $gte: new Date(filters['timestampStart']),
            $lte: endDate
          };
        }
      }
      if (!!filters['fhirResourceType']) {
        filter['fhirResource.resource.resourceType'] = { $regex: this.escapeRegExp(filters['fhirResourceType']), $options: 'i' };
      }
      if (!!filters['user']) {
        filter['$or'] = [
          { 'user.firstName': { $regex: this.escapeRegExp(filters['user']), $options: 'i' } },
          { 'user.lastName': { $regex: this.escapeRegExp(filters['user']), $options: 'i' } }
        ];
      }
    } catch (error) {
    }

    options.pipeline.push({ $match: filter });
    options.hydrate = false;

    // console.log('options.pipeline', JSON.stringify(options.pipeline, null, 2));
    return this.dataService.search(options);

  }


  @Post()
  public async createAudit(@User() user: ITofUser, @Body() audit: IAudit, @Req() req: Request): Promise<AuditDocument> {

    audit.user = user.user;
    audit.timestamp = new Date();
    audit.networkAddr = req.headers['x-forwarded-for']?.toString() || req.socket?.remoteAddress;

    return this.dataService.create(audit);

  }

  @Get('report/:reportId')
  public async getReport(@User() user: ITofUser, @Req() req: Request, @Param('reportId') reportId: string): Promise<Paginated<any>> {
      
      this.assertAdmin(user);

      const report = this.auditReportRepository.getReport(reportId);
      if (!report) {
        throw new TofNotFoundException(`No report found with id ${reportId}`);
      }

      const options = this.getPaginateOptionsFromRequest(req);

      let filters: {[key: string]: any} = {};
      try {
        filters = JSON.parse(<string>req.query?.filters);
      } catch (error) {
      }

      return report.getResults(options, filters);
  }

  @Get('report-list')
  public async getReportList(@User() user: ITofUser): Promise<IReportMetadata[]> {
    this.assertAdmin(user);

    let reports = (await this.auditReportRepository.getReports())
      .filter(r => !!r.id && !!r.name)
      .map(r => {
        return {
          id: r.id,
          name: r.name,
          title: r.title,
          fields: r.fields,
          filters: r.filters,
          defaultSort: r.defaultSort
        };
      });

    return reports;
  }


  @Get(':type/:id')
  public async getResourceAudits(@User() user: ITofUser, @Req() req: Request, @Param('type') type: 'nonFhirResource' | 'fhirResource', @Param('id') id: string): Promise<Paginated<AuditDocument>> {


    const permCheck = await this.authService.userCanByType(user, id, type, 'read');
    if (!permCheck) {
      throw new UnauthorizedException();
    }


    let entityType;
    if (type === 'nonFhirResource') {
      entityType = 'NonFhirResource';
    } else if (type === 'fhirResource') {
      entityType = 'FhirResource';
    } else {
      throw new Error(`Invalid type ${type}`);
    }

    let options = this.getPaginateOptionsFromRequest(req);
    options.pipeline = [
      {
        $match: {
          'entityType': entityType,
          'entityValue': new ObjectId(id)
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
      }
    ];
    options.hydrate = false;

    let res = await this.dataService.search(options);

    // remove potentially sensitive data if user is not an admin
    if (!user.isAdmin) {
      res.results.forEach(audit => {
        delete audit.networkAddr;
        audit.user = {
          firstName: audit.user.firstName,
          lastName: audit.user.lastName,
          name: audit.user.name
        };
      });
    }

    return res;

  }

}
