import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { SpecialistRate, SplitRatio } from '../types/settings.types';

export class UpdateSplitRatioDto {
  @IsNotEmpty()
  @IsString()
  splitRatioId: Types.ObjectId;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => SplitRatio)
  splitRatio: SplitRatio;
}
