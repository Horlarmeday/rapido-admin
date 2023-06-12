import { Rate } from '../types/settings.types';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddRateDto {
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  specialization: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Rate)
  rate: Rate;

  @IsNotEmpty()
  @IsString()
  settingId: string;
}
