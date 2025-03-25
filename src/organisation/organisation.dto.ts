import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  PaymentMethodType,
  ResourceCategory,
  SubscriptionFrequency,
  SubscriptionPlan,
} from 'src/common/enum';

export class OrganisationDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  organisationName: string;

  @IsNotEmpty()
  @IsString()
  typeOfOrganisation: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

export class UpdateOrganisationDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  organisationName?: string;

  @IsOptional()
  @IsString()
  typeOfOrganisation?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  stripeCustomerId?: string;

  @IsOptional()
  @IsString()
  subscription?: Types.ObjectId;
}

export class CreatePaymentMethodDto {
  @IsString()
  last4: string;

  @IsString()
  expirationDate: string;

  @IsString()
  type: string;

  @IsString()
  cardType?: string; //visa, mastercard, verve

  @IsString()
  provider: string; //stripe paypal or paystack

  @IsBoolean()
  isDefault: boolean;

  @IsString()
  paymentMethodId?: string;
}

export class CreateBillingAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  country: string;
}

export class CreateResourceDto {
  @IsString()
  name: string;

  @IsString()
  fileType: string;

  @IsString()
  url: string;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsEnum(ResourceCategory)
  @IsOptional()
  category?: string;
}
