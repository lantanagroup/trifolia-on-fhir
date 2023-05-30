import {Injectable} from '@nestjs/common';
import {BaseDataService} from '../base/base-data.service';
import {Model} from 'mongoose';
import {Audit, AuditDocument} from './audit.schema';
import {InjectModel} from '@nestjs/mongoose';

@Injectable()
export class AuditService extends BaseDataService<AuditDocument> {

  constructor(
    @InjectModel(Audit.name) private auditModel: Model<AuditDocument>
  ) {
    super(auditModel);
  }
}
