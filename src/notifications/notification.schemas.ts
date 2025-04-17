import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Notification {

  @Prop({ type: Types.ObjectId, ref: 'Organisation', required: true }) 
  organisation?: Types.ObjectId; 

  @Prop({ required: true })
  type: NotificationType;

  @Prop({ type: Object, required: true }) 
  data: Record<string, any>; 

  @Prop({ default: false }) 
  read: boolean;

  @Prop({ default: false }) 
  deleted: boolean;
}

export enum NotificationType {
    NewSchoolCreated = 'NewSchoolCreated',
    UserManagement = 'UserManagement',
    PermissionUpdate = 'PermissionUpdate',
    SystemAlerts = 'SystemAlerts',
    AnalyticsUpdate = 'AnalyticsUpdate',
    PaymentAndBilling = 'PaymentAndBilling',
    RegistrationAndSetup = 'RegistrationAndSetup',
  }

export type NotificationDocument = HydratedDocument<Notification>;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
