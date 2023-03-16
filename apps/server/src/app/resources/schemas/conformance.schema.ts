import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { IConformance, IPermission } from '@trifolia-fhir/models';
import type { IDomainResource } from '@trifolia-fhir/tof-lib';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/base.entity';
import { Project } from '../../projects/project.schema';

export type ConformanceDocument = HydratedDocument<Conformance>;

@Schema({ collection: 'conformance' })
export class Conformance extends BaseEntity implements IConformance {

    @Prop()
    name?: string;

    @Prop()
    description?: string;

    @Prop ([{type: ObjectId, ref: Project.name }])
    projects?: Project[];

    @Prop()
    migratedFrom?: string;

    @Prop()
    versionId: number;

    @Prop()
    lastUpdated: Date;

    @Prop()
    permissions?: IPermission[];


    @Prop()
    fhirVersion: 'stu3'|'r4'|'r5';

    @Prop({ type: Object })
    resource: IDomainResource;
}

export const ConformanceSchema = SchemaFactory.createForClass(Conformance);
ConformanceSchema.loadClass(Conformance);
