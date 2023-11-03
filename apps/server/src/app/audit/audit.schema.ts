import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import type {AuditAction, AuditEntityType, AuditEntityValue, IAudit, IAuditPropertyDiff, IUser} from '@trifolia-fhir/models';
import mongoose, {HydratedDocument} from 'mongoose';
import {BaseEntity} from '../base/base.entity';
import { User } from '../server.decorators';

export type AuditDocument = HydratedDocument<Audit>;

@Schema({ collection: 'audit' })
export class Audit extends BaseEntity implements IAudit {

  @Prop({type: mongoose.Schema.Types.String, enum: ['read','update','delete','create','exception','other']})
  action: AuditAction;

  @Prop()
  timestamp: Date;

  @Prop({type: mongoose.Schema.Types.String, enum: ['User','Group','Project','FhirResource','NonFhirResource']})
  entityType?: AuditEntityType;

  @Prop({type: mongoose.Schema.Types.ObjectId, refPath: 'entityType'})
  entityValue?: AuditEntityValue;

  @Prop([{path: mongoose.Schema.Types.String, oldValue: mongoose.Schema.Types.Mixed, newValue: mongoose.Schema.Types.Mixed}])
  propertyDiffs?: IAuditPropertyDiff[];

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  user?: IUser;

  @Prop()
  networkAddr?: string;

  @Prop()
  note?: string;

}

export const AuditSchema = SchemaFactory.createForClass(Audit);
AuditSchema.loadClass(Audit);

