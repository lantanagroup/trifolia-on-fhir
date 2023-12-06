import {Injectable} from '@nestjs/common';
import {BaseDataService} from '../base/base-data.service';
import {Model} from 'mongoose';
import {Audit, AuditDocument} from './audit.schema';
import {InjectModel} from '@nestjs/mongoose';
import type { IAuditPropertyDiff, IBaseEntity } from '@trifolia-fhir/models';
import { diff } from 'deep-diff';

@Injectable()
export class AuditService extends BaseDataService<AuditDocument> {

  constructor(
    @InjectModel(Audit.name) private auditModel: Model<AuditDocument>
  ) {
    super(auditModel);
  }


  /**
   * Returns an array of property diffs between the old and new entity.
   */
  public getAuditPropertyDiffs(oldEntity: IBaseEntity, newEntity: IBaseEntity): IAuditPropertyDiff[] {

    let deepDiff = diff(oldEntity, newEntity);
    if (!deepDiff) {
      return [];
    }

    let differences: IAuditPropertyDiff[] = [];

    for (let difference of deepDiff) {

      let path = '$.' + difference.path.join('.');
      let oldValue = difference.lhs;
      let newValue = difference.rhs;

      if (difference.kind === 'A') {
        path += '[' + difference.index + ']';
        oldValue = difference.item?.lhs;
        newValue = difference.item?.rhs;
      }

      let newDiff: IAuditPropertyDiff = {
        path: path,
        oldValue: oldValue,
        newValue: newValue
      };
      differences.push(newDiff);
    }

    return differences;
  }

}
