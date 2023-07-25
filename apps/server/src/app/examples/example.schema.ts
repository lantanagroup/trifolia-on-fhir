import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { IExample, IPermission } from '@trifolia-fhir/models';
import type { IDomainResource } from '@trifolia-fhir/tof-lib';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import { Project } from '../projects/project.schema';

export type ExampleDocument = HydratedDocument<Example>;

@Schema({ collection: 'example', toJSON: { getters: true } })
export class Example extends BaseEntity implements IExample {

    @Prop()
    name?: string;

    @Prop()
    description?: string;

    @Prop ([{type: mongoose.Schema.Types.ObjectId, ref: Project.name }])
    projects: Project[];

    @Prop()
    migratedFrom?: string;

    @Prop()
    versionId: number;

    @Prop()
    lastUpdated: Date;

    @Prop({
        get: (permissions: IPermission[]) : IPermission[] => {
            if (!permissions || permissions.length < 1) {
                return [{type: 'everyone', grant: 'read'}, {type: 'everyone', grant: 'write'}];
            }
            return permissions;
        }
    })
    permissions?: IPermission[];


    @Prop()
    fhirVersion?: 'stu3'|'r4'|'r5';

    @Prop({ type: Object })
    content?: IDomainResource|any;

    @Prop()
    exampleFor?: string;

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: 'Example' }])
    igIds: string[];

    @Prop()
    isDeleted: boolean;

}

export const ExampleSchema = SchemaFactory.createForClass(Example);
ExampleSchema.loadClass(Example);
