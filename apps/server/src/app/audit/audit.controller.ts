import {Controller, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {BaseDataController} from '../base/base-data.controller';
import {AuditDocument} from './audit.schema';

@Controller('api/audit')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Audit')
@ApiOAuth2([])
export class AuditController extends BaseDataController<AuditDocument> {
}
