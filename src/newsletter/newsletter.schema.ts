
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type NewsletterDocument = HydratedDocument<Newsletter>;

@Schema()
export class Newsletter {

  @Prop({unique: true, required:true})
  email: string;

}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
