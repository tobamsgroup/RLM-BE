import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

interface SchoolRole {
  school: Types.ObjectId;
  roles: UserRole[];
}

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  DEVELOPER = 'developer',
  ASSISTANT_INSTRUCTOR = 'assistant_instructor',
  CONTENT_DEVELOPER = 'content_developer',
  COMMUNITY_MANAGER = 'community_manager',
  CUSTOMER_SUPPORT = 'customer_support',
  MOBILE_APP_MANAGER = 'mobile_app_manager',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ type: Boolean, default: false })
  isGoogleSignUp?: boolean;

  @Prop({ type: String })
  phoneNumber?: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({
    type: [
      {
        school: { type: Types.ObjectId, ref: 'School' },
        roles: [{ type: String, enum: UserRole }],
      },
    ],
  })
  schoolRoles: SchoolRole[];

  @Prop({ type: Types.ObjectId, ref: 'Organisation' })
  organisation: Types.ObjectId;

  @Prop({ type: String, enum:UserStatus, default:UserStatus.INACTIVE})
  status:UserStatus

  @Prop({ type: Date })
  lastLogin?: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
