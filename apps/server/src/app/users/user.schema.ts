import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@trifolia-fhir/models';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../base/base.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user', toJSON: { getters: true }})
export class User extends BaseEntity implements IUser {
    
    @Prop()
    authId?: string[];

    @Prop()
    email?: string;

    @Prop()
    phone?: string;

    @Prop()
    firstName?: string;

    @Prop()
    lastName?: string;

    get name(): string {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`;
    }
    
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
