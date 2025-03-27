import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';
import { UserRole, UserStatus } from './users.schema';

class SchoolRoleDto {
  @IsMongoId()
  @IsNotEmpty()
  school: Types.ObjectId;

  @IsArray()
  @IsEnum(UserRole, { each: true })
  @IsNotEmpty()
  roles: UserRole[];
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isGoogleSignUp?: boolean;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsMongoId()
  @IsNotEmpty()
  school: Types.ObjectId;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsMongoId()
  @IsNotEmpty()
  organisation: Types.ObjectId;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = UserStatus.INACTIVE;

  @IsBoolean() 
  @IsNotEmpty()
  isUserSignUp: boolean
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isGoogleSignUp?: boolean;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @IsArray()
  @IsOptional()
  schoolRoles?: SchoolRoleDto[];

  @IsMongoId()
  @IsOptional()
  organisation?: Types.ObjectId;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsOptional()
  lastLogin?: Date;
}
