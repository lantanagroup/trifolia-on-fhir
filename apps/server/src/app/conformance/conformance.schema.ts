import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import { BaseEntity } from '../base/base.entity'
import {IDomainResource} from '@trifolia-fhir/tof-lib';
import {IConformance} from '@trifolia-fhir/models';

export type ConformanceDocument = HydratedDocument<Conformance>;

@Schema({ collection: 'conformance', toJSON: {getters: true} })
export class Conformance extends BaseEntity implements IConformance {

    @Prop()
    migratedFrom?: string;

    @Prop({type: Object})
    resource: IDomainResource;

    @Prop()
    fhirVersion: 'stu3'|'r4'|'r5';

    @Prop ()
    projectId: string[];

}

export const ConformanceSchema = SchemaFactory.createForClass(Conformance);

