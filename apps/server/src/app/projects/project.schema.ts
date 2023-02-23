import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { IImplementationGuide } from '@trifolia-fhir/tof-lib';
import { IProject, IProjectContributor, IProjectPermission } from '@trifolia-fhir/models';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../base/base.entity';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'project' })
export class Project extends BaseEntity implements IProject {
    
    @Prop()
    name: string;

    @Prop()
    authorId: string;

    @Prop()
    contributors?: IProjectContributor[];

    @Prop()
    fhirVersion: 'stu3'|'r4'|'r5';

    @Prop()
    permissions?: IProjectPermission[];

    @Prop({ type: Object })
    ig: IImplementationGuide;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

