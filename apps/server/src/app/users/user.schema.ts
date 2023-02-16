import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@trifolia-fhir/models';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../base/base.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user' })
export class User extends BaseEntity implements IUser {
    
    @Prop()
    authId?: string[];

    @Prop()
    email?: string;

    @Prop()
    phone?: string;

    @Prop()
    name?: string;
    
}

export const UserSchema = SchemaFactory.createForClass(User);

