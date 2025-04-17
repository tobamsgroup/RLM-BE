import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type SchoolDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true, versionKey: false })
export class Invoice {
  @Prop({ required: true })
  amount: number;

  @Prop()
  status: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  period: string;

  @Prop()
  number: string;

  @Prop({ type: Types.ObjectId, ref: 'School' })
  school: Types.ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
