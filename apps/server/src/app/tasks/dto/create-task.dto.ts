import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
