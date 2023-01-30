import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { IImplementationGuide } from 'libs/tof-lib/src/lib/fhirInterfaces';
//import { HydratedDocument } from 'mongoose';
import { IProject, IProjectContributor, IProjectPermission } from '../models';

export type ProjectDocument = Project & Document; //HydratedDocument<Project> & Document;

@Schema({ collection: 'project' })
export class Project implements IProject {
    
    @Prop()
    _id?: string;

    @Prop()
    name: string;

    @Prop()
    authorId: string;

    @Prop()
    contributors?: IProjectContributor[];

    @Prop()
    fhirVersion: 'stu3'|'r4';

    @Prop()
    permissions?: IProjectPermission[];

    @Prop({ type: Object })
    ig: IImplementationGuide;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

