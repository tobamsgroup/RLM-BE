import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type StripeProductDocument = HydratedDocument<StripeProduct>;

@Schema()
export class StripeProduct {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  stripeProductId: string;

  @Prop({ required: true })
  stripePriceId: string;

  @Prop({ required: true })
  price: number  
}

export const StripeProductSchema = SchemaFactory.createForClass(StripeProduct);
