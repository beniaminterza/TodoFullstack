import { Type } from 'class-transformer';
import {
  Equals,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

enum SortBy {
  createdAt,
  updatedAt,
  name,
  _id,
}

export class GetTasksDto {
  @IsOptional()
  filter: string;
  @IsOptional()
  @IsEnum(SortBy)
  sortBy: string;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  order: number;
}
