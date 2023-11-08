import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {BaseDataController} from '../base/base-data.controller';
import {AuditDocument} from './audit.schema';
import { type ITofUser, Paginated } from '@trifolia-fhir/tof-lib';
import { User } from '../server.decorators';
import { AuditService } from './audit.service';

@Controller('api/audits')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Audit')
@ApiOAuth2([])
export class AuditController extends BaseDataController<AuditDocument> {

  constructor(auditService: AuditService) {
    super(auditService);  
  }


  @Get()
  public async searchAudits(@User() user: ITofUser, @Request() req?: any): Promise<Paginated<AuditDocument>> {

    this.assertAdmin(user);

    let options = this.getPaginateOptionsFromRequest(req);
    options.populate = ['entityValue', 'user'];
    return await this.dataService.search(options);
      
  }

}
