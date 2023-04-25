import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Wallet {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    default: 'NGN',
  })
  currency: string;

  @Prop({ type: Number, default: 0 })
  available_balance: number;

  @Prop({ type: Number, default: 0 })
  ledger_balance: number;
}
export const WalletSchema = SchemaFactory.createForClass(Wallet);
