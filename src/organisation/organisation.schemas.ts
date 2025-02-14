
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type OrganisationDocument = HydratedDocument<Organisation>;

@Schema()
export class Organisation {

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({required:true})
  organisationName: string;

  @Prop()
  organisationUrl: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'School' }] })
  schools: Types.ObjectId[];

  @Prop()
  typeOfOrganisation: string;

  @Prop({required:true})
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  country: string;

  @Prop()
  password: string;

  @Prop({default:false})
  isVerified:boolean;

  @Prop({default:false})
  mfaEnabled:boolean
}

export const OrganisationSchema = SchemaFactory.createForClass(Organisation);
