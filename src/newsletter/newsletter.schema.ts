import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewsletterDocument = HydratedDocument<Newsletter>;

@Schema({ timestamps: true, versionKey: false })
export class Newsletter {
  @Prop({ unique: true, required: true })
  email: string;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
