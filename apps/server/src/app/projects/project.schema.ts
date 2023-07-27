import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type {IProject, IProjectContributor, IPermission} from '@trifolia-fhir/models';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import { FhirResource } from '../fhirResources/fhirResource.schema';
import {IProjectResourceReference} from '@trifolia-fhir/models';

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

    @Prop([{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'referencedBy.valueType'}, valueType: {type:String, enum:['Project']}}])
    referencedBy: IProjectResourceReference[];

    @Prop([{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'references.valueType'}, valueType: {type:String, enum:['FhirResource', 'NonFhirResource']}}])
    references: IProjectResourceReference[];

    @Prop()
    isDeleted: boolean = false;
}


export const ProjectSchema = SchemaFactory.createForClass(Project);

