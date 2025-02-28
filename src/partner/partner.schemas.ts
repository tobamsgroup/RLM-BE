import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type PartnerDocument = HydratedDocument<Partner>;

@Schema()
export class Partner {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  organisationName: string;

  @Prop()
  additionalInfo: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  country: string;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
