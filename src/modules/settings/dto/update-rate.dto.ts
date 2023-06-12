import { Types } from 'mongoose';
import { Rate, SpecialistRate } from '../types/settings.types';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRateDto {
  @IsNotEmpty()
  @IsString()
  rateId: Types.ObjectId;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => SpecialistRate)
  specialistRate: SpecialistRate;
}
