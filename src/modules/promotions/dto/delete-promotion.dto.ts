import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class DeletePromotionDto {
  @IsNotEmpty()
  @IsString()
  promotionId: Types.ObjectId;
}
