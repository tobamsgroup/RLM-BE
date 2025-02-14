import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
