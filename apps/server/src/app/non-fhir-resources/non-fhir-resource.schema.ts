import type { INonFhirResource } from '@trifolia-fhir/models';
import { NonFhirResource, NonFhirResourceType } from '@trifolia-fhir/models';
import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { Project } from '../projects/project.schema';
import { FhirResource } from '../fhirResources/fhirResource.schema';




export type NonFhirResourceDocument = HydratedDocument<NonFhirResource>;


export const NonFhirResourceSchema = new Schema<INonFhirResource>({
    name: String,
    description: String,
    projects: [{type: mongoose.Schema.Types.ObjectId, ref: Project.name }],
    migratedFrom: String,
    versionId: Number,
    lastUpdated: Date,
    content: { type: Object },
    type: { type: String, required: true, enum: Object.values(NonFhirResourceType), default: NonFhirResourceType.OtherNonFhirResource },
    referencedBy: [{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'referencedBy.valueType'}, valueType: {type:String, enum:[FhirResource.name, NonFhirResource.name, Project.name]}}],
    references: [{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'references.valueType'}, valueType: {type:String, enum:[FhirResource.name, NonFhirResource.name]}}],
    isDeleted: Boolean

}, { collection: 'nonFhirResource', toJSON: { getters: true }, discriminatorKey: 'type' });

