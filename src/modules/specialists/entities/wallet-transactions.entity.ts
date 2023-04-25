import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WalletTransactionDocument = HydratedDocument<WalletTransaction>;

export enum TransactionType {
  DEBIT = 'Debit',
  CREDIT = 'Credit',
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class WalletTransaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true })
  walletId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Bank' })
  bankId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, default: 0, required: true })
  amount: number;

  @Prop({ type: String })
  narration: string;

  @Prop({ type: String })
  reference: string;

  @Prop({
    type: String,
    enum: { values: [TransactionType.CREDIT, TransactionType.DEBIT] },
    default: TransactionType.DEBIT,
  })
  type: number;
}

export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);
