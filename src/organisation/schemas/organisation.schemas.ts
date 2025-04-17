import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentMethodType, ResourceCategory, SubscriptionPlan, SubscriptionStatus } from 'src/common/enum';
import { NotificationType } from 'src/notifications/notification.schemas';

export type OrganisationDocument = HydratedDocument<Organisation>;




export class ResourceLimits {
  @Prop({ type: Number, default: 5 })
  maxStorage: number;

  @Prop({ type: Number, default: 10 })
  maxUsers: number;

  @Prop({ type: Number, default: 1000 })
  apiRateLimit: number;
}

export class PaymentMethod {
  @Prop()
  id: string;

  @Prop({
    type: String,
    enum: PaymentMethodType,
    required: true,
  })
  type: string;

  @Prop({ type: String })
  last4?: string;

  @Prop({ type: String })
   cardType?: string; //visa, mastercard, verve

  @Prop({ type: String })
  provider: string;  //stripe paypal or paystack

  @Prop({ type: String }) // Format: MM/YYYY
  expirationDate?: string;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop()
  paymentMethodId?: string // will be used for recurring subscription charges 
}

export class BillingAddress {
  @Prop()
  street: string;

  @Prop()
  firstname?: string;

  @Prop()
  lastname?: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  postalCode: string;

  @Prop()
  country: string;
}

export class Resource {
  @Prop({ required: true })
  name: string; 

  @Prop({ required: true })
  fileType: string; 

  @Prop({ required: true })
  url: string; 

  @Prop()
  size: number; 

  @Prop({ required: true, enum: ResourceCategory })
  category: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;

}

@Schema({ timestamps: true, versionKey: false })
export class Organisation {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  organisationName: string;

  @Prop()
  organisationUrl: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'School' }] })
  schools: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Subscription' })
  subscription: Types.ObjectId;

  @Prop()
  typeOfOrganisation: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  country: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false }) //used for google auth on the FE for completing signup
  isFirstTime: boolean;

  @Prop({ default: false }) //used for google auth on the FE for completing signup
  isGoogleSignUp: boolean;

  @Prop({ default: false })
  mfaEnabled: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }] })
  notifications: Types.ObjectId[];

  @Prop({
    type: Map,
    of: {
      inApp: { type: Boolean},
      email: { type: Boolean},
    },
    default: {},
  })
  notificationPreferences: Map<NotificationType, NotificationPreference>;

  @Prop()
  stripeCustomerId: string

  @Prop({default:false})
  closed: boolean

  @Prop()
  closedAt: Date

  @Prop()
  closureReason: string

  @Prop({ type: [PaymentMethod], default: [] })
  paymentMethods: PaymentMethod[];

  @Prop({ type: BillingAddress })
  billingAddress?: BillingAddress;

  @Prop({ type: [Resource], default: [] })
  resources: Resource[]
}

export type NotificationPreference = {
  inApp: boolean;
  email: boolean;
};


export const OrganisationSchema = SchemaFactory.createForClass(Organisation);
