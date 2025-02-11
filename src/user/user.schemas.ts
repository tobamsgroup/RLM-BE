
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

  @Prop()
  firstName: string;

  @Prop()
  lastName: number;

  @Prop()
  organisationName: string;

  @Prop()
  organisationUrl: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'School' }] })
  schools: Types.ObjectId[];

  @Prop()
  typeOfOrganisation: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  country: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
