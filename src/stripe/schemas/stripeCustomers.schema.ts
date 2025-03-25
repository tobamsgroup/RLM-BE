import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type StripeCustomerDocument = HydratedDocument<StripeCustomer>;

@Schema()
export class StripeCustomer {
  @Prop({ type: Types.ObjectId, ref: 'Organisation', required: true }) 
  organisation: Types.ObjectId;

  @Prop({ required: true })
  stripeCustomerId: string;

  @Prop({ required: true })
  stripePriceId: string;
  
}

export const StripeCustomerSchema = SchemaFactory.createForClass(StripeCustomer);
