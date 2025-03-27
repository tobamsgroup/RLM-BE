import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type SchoolDocument = HydratedDocument<School>;

class About {
    @Prop({ required: true })
    goal: string;
  
    @Prop({ type: [String], default: [] }) 
    targetUsers: string[];

    @Prop({ required: true }) 
    scale: string;

    @Prop({ required: true }) 
    experience: string;

    @Prop({ required: true }) 
    focusArea: string;
  }

@Schema({ timestamps: true, versionKey: false })
export class School {
  @Prop({required:true})
  name: string;

  @Prop()
  domain: string;

  @Prop()
  logo: string;

  @Prop()
  primaryColor: string;

  @Prop()
  secondaryColor: string;

  @Prop()
  websiteTemplate: string;

  @Prop({ required: true })
  about: About

  @Prop({ default: 'INACTIVE' })
  status: SchoolStatus

  @Prop({default:"FREE"})
  plan: string

  @Prop({ type: Types.ObjectId, ref: 'Organisation', required: true }) 
  organisation: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  users: Types.ObjectId[]

}

export enum SchoolStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE"
}

export const SchoolSchema = SchemaFactory.createForClass(School);
