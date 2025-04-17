import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Mongoose, Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type SchoolDocument = HydratedDocument<ActivityLogs>;

@Schema({ timestamps: true, versionKey: false })
export class ActivityLogs {
  @Prop({ required: true })
  action: string;


  @Prop({ type: Types.ObjectId, ref: 'School' })
  school: Types.ObjectId;

}

export const ActivityLogsSchema = SchemaFactory.createForClass(ActivityLogs);
