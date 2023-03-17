import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type {IProject, IProjectContributor, IPermission} from '@trifolia-fhir/models';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import { Conformance } from '../resources/schemas/conformance.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'project' })
export class Project extends BaseEntity implements IProject {

    @Prop()
    name: string;

    @Prop()
    author: string;

    @Prop()
    contributors?: IProjectContributor[];

    @Prop()
    fhirVersion: 'stu3'|'r4'|'r5';

    @Prop()
    permissions?: IPermission[];

    @Prop ([{type: mongoose.Schema.Types.ObjectId, ref: Conformance.name }])
    igs: Conformance[];

}


export const ProjectSchema = SchemaFactory.createForClass(Project);

