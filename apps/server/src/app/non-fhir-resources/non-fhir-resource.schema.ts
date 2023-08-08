import type { INonFhirResource, IPermission } from '@trifolia-fhir/models';
import { NonFhirResource, NonFhirResourceType } from '@trifolia-fhir/models';
import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { Project } from '../projects/project.schema';
import { FhirResource } from '../fhirResources/fhirResource.schema';




export type NonFhirResourceDocument = HydratedDocument<NonFhirResource>;



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

