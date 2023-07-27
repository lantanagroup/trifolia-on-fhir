import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type {IHistory, IPermission, IProjectResourceReference} from '@trifolia-fhir/models';
import type { IDomainResource } from '@trifolia-fhir/tof-lib';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import { Project } from '../projects/project.schema';

export type HistoryDocument = HydratedDocument<History>;

@Schema({ collection: 'history' })
export class History extends BaseEntity implements IHistory {

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

    @Prop()
    permissions?: IPermission[];


    @Prop()
    fhirVersion?: 'stu3'|'r4'|'r5';

    @Prop({type: Object})
    content?: IDomainResource|any;

    @Prop([{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'references.valueType'}, valueType: {type:String, enum:['FhirResource', 'NonFhirResource']}}])
    current: IProjectResourceReference;


    @Prop()
    isDeleted: boolean;
}

export const HistorySchema = SchemaFactory.createForClass(History);
HistorySchema.loadClass(History);
