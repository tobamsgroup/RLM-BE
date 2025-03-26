import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {  Types } from 'mongoose';
import { ResourceCategory } from './resources.schema';


export class SaveResourcesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString() 
  organisation?: Types.ObjectId; 

  @IsString() 
  school?: Types.ObjectId; 

  @IsNotEmpty()
  @IsEnum(ResourceCategory)
  category:ResourceCategory

  @IsNotEmpty()
  @IsString() 
  url: string;

  @IsString()
  size: string;

  @IsString()
  mimeType: string;
}
