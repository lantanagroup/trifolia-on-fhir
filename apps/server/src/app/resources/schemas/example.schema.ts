import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { IExample, IPermission } from '@trifolia-fhir/models';
import type { IDomainResource } from '@trifolia-fhir/tof-lib';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/base.entity';
import { Project } from '../../projects/project.schema';

export type ExampleDocument = HydratedDocument<Example>;

@Schema({ collection: 'example' })
export class Example extends BaseEntity implements IExample {

    @Prop()
    name?: string;

    @Prop()
    description?: string;

    @Prop ([{type: ObjectId, ref: Project.name }])
    projects: Project[];

    @Prop()
    migratedFrom?: string;

    @Prop()
    versionId: number;

    @Prop()
    lastUpdated: Date;

    @Prop()
    permissions?: IPermission[];


    @Prop()
    fhirVersion?: 'stu3'|'r4'|'r5';

    @Prop({ type: Object })
    content?: IDomainResource|any;

    @Prop()
    exampleFor?: string;
}

export const ExampleSchema = SchemaFactory.createForClass(Example);
ExampleSchema.loadClass(Example);
