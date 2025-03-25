import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class RefreshToken extends Document {
  @Prop({ required: true })
  token: string;
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  organisationId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  expiryDate: Date;
  @Prop({ required: true })
  ttl: number
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);