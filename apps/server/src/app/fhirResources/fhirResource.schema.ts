import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type {IFhirResource, IPermission,  IProjectResourceReference} from '@trifolia-fhir/models';
import type { IDomainResource } from '@trifolia-fhir/tof-lib';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import { Project } from '../projects/project.schema';

export type FhirResourceDocument = HydratedDocument<FhirResource>;


@Schema({ collection: 'fhirResource', toJSON: { getters: true } })
export class FhirResource extends BaseEntity implements IFhirResource {

    @Prop()
    name?: string;

    @Prop()
    description?: string;

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: 'Project' }])
    projects?: Project[];

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


    @Prop()
    fhirVersion: 'stu3'|'r4'|'r5';

    @Prop({ type: Object })
    resource: IDomainResource;

    @Prop([{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'referencedBy.valueType'}, valueType: {type:String, enum:['FhirResource', 'NonFhirResource', 'Project']}}])
    referencedBy: IProjectResourceReference[];

    @Prop([{value: {type: mongoose.Schema.Types.ObjectId, refPath: 'references.valueType'}, valueType: {type:String, enum:['FhirResource', 'NonFhirResource']}}])
    references: IProjectResourceReference[];

    @Prop()
    isDeleted: boolean;

}

export const FhirResourceSchema = SchemaFactory.createForClass(FhirResource);
FhirResourceSchema.loadClass(FhirResource);
