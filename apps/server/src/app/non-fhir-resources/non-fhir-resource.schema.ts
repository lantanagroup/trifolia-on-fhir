import type { INonFhirResource, IPermission, IProject, IProjectResourceReference } from '@trifolia-fhir/models';
import { NonFhirResourceType } from '@trifolia-fhir/models';
import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import { Project } from '../projects/project.schema';
import { FhirResource } from '../fhirResources/fhirResource.schema';




export type NonFhirResourceDocument = HydratedDocument<NonFhirResource>;

export abstract class NonFhirResource extends BaseEntity implements INonFhirResource {
    type: NonFhirResourceType;
    content?: any;
    name?: string;
    description?: string;
    projects?: IProject[];
    migratedFrom?: string;
    versionId: number;
    lastUpdated: Date;
    permissions?: IPermission[];
    referencedBy?: IProjectResourceReference[];
    references?: IProjectResourceReference[];
    isDeleted?: boolean;
    
}


const PermissionSchema = new Schema<IPermission>({
    targetId: String,
    type: { type: String, enum: ['user','group','everyone'] },
    grant: { type: String, enum: ['read','write'] }
}, {toJSON: { getters: true } });

export const NonFhirResourceSchema = new Schema<INonFhirResource>({
    name: String,
    description: String,
    projects: [{type: mongoose.Schema.Types.ObjectId, ref: Project.name }],
    migratedFrom: String,
    versionId: Number,
    lastUpdated: Date,
    permissions: [PermissionSchema],
    content: { type: Object },
    type: { type: String, required: true, enum: Object.values(NonFhirResourceType) },
    referencedBy: [{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'referencedBy.valueType'}, valueType: {type:String, enum:[FhirResource.name, NonFhirResource.name, Project.name]}}],
    references: [{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'references.valueType'}, valueType: {type:String, enum:[FhirResource.name, NonFhirResource.name]}}],
    isDeleted: Boolean

}, { collection: 'nonFhirResource', toJSON: { getters: true }, discriminatorKey: 'type' });

NonFhirResourceSchema.loadClass(NonFhirResource);




