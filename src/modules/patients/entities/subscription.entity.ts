import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

export enum SubscriptionStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled',
  DECLINED = 'Declined',
  PENDING = 'Pending',
}

export enum Recurrence {
  MONTHLY = 'Monthly',
  ANNUALLY = 'Annually',
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Subscription {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true })
  cardId: Types.ObjectId;

  @Prop({ type: Date })
  current_period_end: Date;

  @Prop({
    type: String,
    enum: {
      values: [
        SubscriptionStatus.ACTIVE,
        SubscriptionStatus.CANCELLED,
        SubscriptionStatus.DECLINED,
        SubscriptionStatus.EXPIRED,
        SubscriptionStatus.PENDING,
      ],
    },
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Prop({ type: Number })
  amount_paid: number;

  @Prop({
    type: String,
    enum: { values: [Recurrence.ANNUALLY, Recurrence.MONTHLY] },
    required: true,
  })
  recurrence: Recurrence;
}
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
