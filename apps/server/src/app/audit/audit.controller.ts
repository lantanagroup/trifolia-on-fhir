import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {BaseDataController} from '../base/base-data.controller';
import {AuditDocument} from './audit.schema';
import { type ITofUser, Paginated } from '@trifolia-fhir/tof-lib';
import { User } from '../server.decorators';
import { AuditService } from './audit.service';
import { type IAudit } from '@trifolia-fhir/models';
import { Request } from 'express';

@Controller('api/audits')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Audit')
@ApiOAuth2([])
export class AuditController extends BaseDataController<AuditDocument> {

  constructor(auditService: AuditService) {
    super(auditService);  
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
      },
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
          {'user.firstName': { $regex: this.escapeRegExp(filters['user']), $options: 'i' }},
          {'user.lastName': { $regex: this.escapeRegExp(filters['user']), $options: 'i' }}
        ];
      }
    } catch (error) {
    }

    options.pipeline.push({$match: filter});
    options.hydrate = false;

    // console.log('options.pipeline', JSON.stringify(options.pipeline, null, 2));
    return this.dataService.search(options);
      
  }


  @Post()
  public async createAudit(@User() user: ITofUser, @Body() audit: IAudit, @Req() req: Request): Promise<AuditDocument> {

    audit.user = user.user;
    audit.timestamp = new Date();
    audit.networkAddr = req.socket.remoteAddress;

    return this.dataService.create(audit);
      
  }

}
