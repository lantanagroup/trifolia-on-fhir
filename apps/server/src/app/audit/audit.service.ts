import {ExecutionContext, Injectable} from '@nestjs/common';
import {BaseDataService} from '../base/base-data.service';
import {Model} from 'mongoose';
import {Audit, AuditDocument} from './audit.schema';
import {InjectModel} from '@nestjs/mongoose';
import type { IAudit, IAuditPropertyDiff, IBaseEntity } from '@trifolia-fhir/models';
import { diff } from 'deep-diff';
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from './audit.decorator';
import { Reflector } from '@nestjs/core';
import { ITofRequest } from '../models/tof-request';

@Injectable()
export class AuditService extends BaseDataService<AuditDocument> {

  constructor(
    @InjectModel(Audit.name) private auditModel: Model<AuditDocument>,
    private readonly reflector: Reflector
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

  public getNetworkAddress(req: ITofRequest): string {
    return req.headers['x-forwarded-for']?.toString() || req.socket?.remoteAddress || 'unknown';
  }

  public getAuditFromContext(context: ExecutionContext): IAudit {

    let auditAction = this.reflector.get(AUDIT_ACTION, context.getHandler());
    let auditEntityType = this.reflector.get(AUDIT_ENTITY_TYPE, context.getHandler());

    let req = context.switchToHttp().getRequest();

    let auditEvent: IAudit = {
      action: auditAction,
      entityType: auditEntityType,
      timestamp: new Date(),
      user: req.user?.user,
      networkAddr: this.getNetworkAddress(req)
    };

    return auditEvent;

  }

}
