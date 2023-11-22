import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type {IProject, IProjectContributor, IPermission, IUser} from '@trifolia-fhir/models';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import type { IProjectResourceReference } from '@trifolia-fhir/models';
import {User} from '../server.decorators';

export type ProjectDocument = HydratedDocument<Project>;

const PermissionSchema = new MongooseSchema<IPermission>({
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: (doc) => { return ['User','Group'].indexOf(doc.type) > -1 ? doc.type : null; }
    },
    type: { type: String, enum: ['User','Group','everyone'] },
    grant: { type: String, enum: ['read','write'] },
});


@Schema({ collection: 'project', toJSON: { getters: true } })
export class Project extends BaseEntity implements IProject {

    @Prop()
    name: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name }])
    author: IUser[];

    @Prop()
    contributors?: IProjectContributor[];

    @Prop()
    fhirVersion: 'stu3'|'r4'|'r5';

    @Prop([PermissionSchema])
    permissions?: IPermission[];

    @Prop([{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'referencedBy.valueType'}, valueType: {type:String, enum:['Project']}}])
    referencedBy: IProjectResourceReference[];

    @Prop([{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'references.valueType'}, valueType: {type:String, enum:['FhirResource', 'NonFhirResource']}}])
    references: IProjectResourceReference[];

    @Prop()
    isDeleted: boolean = false;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.path('permissions').get((permissions: IPermission[]) : IPermission[] => {
    if (!permissions || permissions.length < 1) {
        return [{type: 'everyone', grant: 'read'}, {type: 'everyone', grant: 'write'}];
    }
    return permissions;
});

ProjectSchema.loadClass(Project);
