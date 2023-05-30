import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {IAudit} from '@trifolia-fhir/models';
import {HydratedDocument} from 'mongoose';
import {BaseEntity} from '../base/base.entity';

export type AuditDocument = HydratedDocument<Audit>;

@Schema({ collection: 'audit' })
export class Audit extends BaseEntity implements IAudit {

  @Prop()
  action: 'read' | 'create' | 'delete' | 'update';

  @Prop()
  networkAddr?: string;

  @Prop()
  note?: string;

  @Prop()
  timestamp: Date;

  @Prop()
  what: string;

  @Prop()
  who: string;

}

export const AuditSchema = SchemaFactory.createForClass(Audit);
AuditSchema.loadClass(Audit);

