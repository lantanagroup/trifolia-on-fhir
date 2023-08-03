import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { INonFhirResource, IPermission, IProject, IProjectResourceReference, NonFhirResourceType } from '@trifolia-fhir/models';
import type { IDomainResource } from '@trifolia-fhir/tof-lib';
import mongoose from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import { Project } from '../projects/project.schema';



@Schema({ collection: 'nonFhirResource', toJSON: { getters: true }, discriminatorKey: 'type' })
export class NonFhirResource extends BaseEntity implements INonFhirResource {

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

    @Prop({
        get: (permissions: IPermission[]) : IPermission[] => {
            if (!permissions || permissions.length < 1) {
                return [{type: 'everyone', grant: 'read'}, {type: 'everyone', grant: 'write'}];
            }
            return permissions;
        }
    })
    permissions?: IPermission[];

    @Prop({ type: Object })
    content?: IDomainResource|any;
    
    @Prop({ type: String, required: true, enum: Object.values(NonFhirResourceType) })
    readonly type: NonFhirResourceType;

    @Prop([{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'referencedBy.valueType'}, valueType: {type:String, enum:['FhirResource', 'NonFhirResource', 'Project']}}])
    referencedBy: IProjectResourceReference[];

    @Prop([{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'references.valueType'}, valueType: {type:String, enum:['FhirResource', 'NonFhirResource']}}])
    references: IProjectResourceReference[];

    @Prop()
    isDeleted: boolean;

}

export const NonFhirResourceSchema = SchemaFactory.createForClass(NonFhirResource);
NonFhirResourceSchema.loadClass(NonFhirResource);


export abstract class NonFhirResourceBase implements INonFhirResource {
    type: NonFhirResourceType;
    content?: any;
    id?: string;
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


