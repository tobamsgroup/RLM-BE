import { IsString, IsNotEmpty, IsOptional, IsMongoId, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class AboutDto {
  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsArray()
  @IsString({ each: true })
  useCases: string[];

  @IsString()
  @IsNotEmpty()
  scale: string;

  @IsString()
  @IsNotEmpty()
  experience: string;

  @IsString()
  @IsNotEmpty()
  focusArea: string;
}

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  websiteTemplate?: string;

  @ValidateNested()
  @Type(() => AboutDto)
  about: AboutDto;

  @IsMongoId()
  @IsNotEmpty()
  organisation: string;
}

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  websiteTemplate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AboutDto)
  about?: AboutDto;

  @IsOptional()
  @IsMongoId()
  organisation?: string;
}
