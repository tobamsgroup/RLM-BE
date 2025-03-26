import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Resources {

  @Prop({ type: Types.ObjectId, ref: 'Organisation', required: true }) 
  organisation?: Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: 'School' }) 
  school?: Types.ObjectId; 

  @Prop({ required: true })
  category: ResourceCategory;

  @Prop({ required: true }) 
  url: string 

  @Prop({ required: true }) 
  name: string 

  @Prop() 
  size?: string;

  @Prop() 
  mimeType?:string
}

export enum ResourceCategory {
   IMAGE='image',
   VIDEO='video',
   DOCUMENT='document'
  }

export type ResourcesDocument = HydratedDocument<Resources>;
export const ResourcesSchema = SchemaFactory.createForClass(Resources);
