import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import { BaseEntity } from '../base/base.entity';
import type {IGroup, IUser} from '@trifolia-fhir/models';
import * as mongoose from 'mongoose';
import {User} from '../users/user.schema';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ collection: 'group', toJSON: {virtuals: true} })
export class Group extends BaseEntity implements IGroup {

    @Prop()
    migratedFrom?: string;

    @Prop({required: true})
    name: string;

    @Prop()
    description?: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name })
    managingUser: IUser;

    @Prop ([{type: mongoose.Schema.Types.ObjectId, ref: User.name }])
    members: IUser[];

}

export const GroupSchema = SchemaFactory.createForClass(Group);

