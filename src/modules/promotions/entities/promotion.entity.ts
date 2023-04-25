import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PromotionDocument = HydratedDocument<Promotion>;
export enum PromotionType {
  REFERRAL = 'Referral',
  LOYALTY = 'Loyalty',
}

export enum UserClass {
  LESS_THAN_THREE_MONTHS = 'Less than 3 months',
  GREATER_THAN_THREE_MONTHS = 'Greater than 3 months',
  NEWLY_REGISTERED = 'Newly registered',
}

export enum PromotionStatus {
  ACTIVE = 'Active',
  DEACTIVATED = 'Deactivated',
  INACTIVE = 'Inactive',
}

export enum RewardType {
  FIXED = 'Fixed',
  PERCENT = 'Percentage',
  MIXED = 'Mixed',
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Promotion {
  @Prop({
    type: String,
    enum: { values: [PromotionType.LOYALTY, PromotionType.REFERRAL] },
    required: true,
  })
  type: PromotionType;

  @Prop({
    type: String,
    enum: { values: [RewardType.FIXED, RewardType.MIXED, RewardType.PERCENT] },
    required: true,
  })
  reward_type: RewardType;

  @Prop({ type: String })
  code: string;

  @Prop({ type: Number })
  percent_off: number;

  @Prop({ type: Date })
  start_date: Date;

  @Prop({ type: Date })
  end_date: Date;

  @Prop({
    type: String,
    enum: {
      values: [
        UserClass.GREATER_THAN_THREE_MONTHS,
        UserClass.NEWLY_REGISTERED,
        UserClass.LESS_THAN_THREE_MONTHS,
      ],
    },
  })
  user_class: UserClass;

  @Prop({ type: Number })
  value: number;

  @Prop({
    type: String,
    enum: {
      values: [
        PromotionStatus.ACTIVE,
        PromotionStatus.DEACTIVATED,
        PromotionStatus.INACTIVE,
      ],
    },
    default: PromotionStatus.INACTIVE,
  })
  status: PromotionStatus;
}
const PromotionSchema = SchemaFactory.createForClass(Promotion);
PromotionSchema.index({
  type: 'text',
  reward_type: 'text',
  user_class: 'text',
});
export { PromotionSchema };
