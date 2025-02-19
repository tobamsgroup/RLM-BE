import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

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
}
