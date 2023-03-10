import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { IImplementationGuide } from '@trifolia-fhir/tof-lib';
import {IProject, IProjectContributor, IPermission, IConformance} from '@trifolia-fhir/models';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import mongoose from 'mongoose';
import {Conformance} from '../conformance/conformance.schema';

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

/*    @Prop({ type: Object })
    ig: IImplementationGuide;*/

    @Prop ([{type: mongoose.Schema.Types.ObjectId, ref: 'Conformance' }])
    igs: Conformance[];

}


export const ProjectSchema = SchemaFactory.createForClass(Project);

