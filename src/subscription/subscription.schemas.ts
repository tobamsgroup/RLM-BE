import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SubscriptionStatus } from 'src/common/enum';

@Schema({ timestamps: true, versionKey: false })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'Organisation', required: true })
  organisation: Types.ObjectId;

  @Prop({required:true})
  name:string

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  currentPeriodStartDate?: Date;

  @Prop({ type: String, enum: ['monthly', 'yearly'], required: true })
  frequency: string;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({
    type: String,
    enum: SubscriptionStatus,
  })
  status: string;

  @Prop()
  nextBillingDate?: Date

  @Prop()
  maxSchoolsAllowed?: number;

  @Prop()
  cancellationReason?: string;

  @Prop()
  paymentSubscriptionId?: string;
}

export type SubscriptionDocument = HydratedDocument<Subscription>;
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
