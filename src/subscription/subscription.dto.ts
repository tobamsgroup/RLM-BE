import { IsDate, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSubscriptionDto {
  @IsString()
  organisation: string | Types.ObjectId

  @IsString()
  name:string

  @IsDate()
  startDate: Date;

  @IsString()
  status: string;

  @IsString()
  paymentSubscriptionId: string;
}
