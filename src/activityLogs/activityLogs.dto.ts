import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLogsDto {
  @IsNumber()
  @IsNotEmpty()
  action: string;
}