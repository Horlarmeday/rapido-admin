import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ChangePromotionStatusDto {
  @IsNotEmpty()
  @IsString()
  promotionId: Types.ObjectId;
}
