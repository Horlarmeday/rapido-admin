import { PromotionType, RewardType } from '../entities/promotion.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePromotionDto {
  @IsNotEmpty()
  @IsEnum(PromotionType)
  readonly type: PromotionType;

  @IsNotEmpty()
  @IsEnum(RewardType)
  readonly reward_type: RewardType;

  @IsOptional()
  readonly code: string;

  @IsOptional()
  readonly start_date: Date;

  @IsOptional()
  readonly end_date: Date;

  @IsNotEmpty()
  @IsString()
  readonly user_class: string;

  @IsOptional()
  readonly value: number;

  @IsOptional()
  readonly percent_off: number;

  readonly promotionId: Types.ObjectId;
}
