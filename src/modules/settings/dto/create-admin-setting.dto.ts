import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AdminDefaultSettingsTypes } from '../types/settings.types';
import { Types } from 'mongoose';

export class CreateAdminSettingDto {
  _id: Types.ObjectId;

  @ValidateNested({ each: true })
  @Type(() => AdminDefaultSettingsTypes)
  defaults: AdminDefaultSettingsTypes;
}
