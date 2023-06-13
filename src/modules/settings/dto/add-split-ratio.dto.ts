import { Rate } from '../types/settings.types';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AddSplitRatioDto {
  @IsNotEmpty()
  @IsString()
  display_name: string;

  @IsNotEmpty()
  @IsNumber()
  percentage: number;

  @IsNotEmpty()
  @IsString()
  settingId: string;
}
