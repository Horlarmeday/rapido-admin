import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  AdminDefaultSettingsTypes,
  PaymentProvider,
} from '../types/settings.types';
import { HydratedDocument } from 'mongoose';

export type AdminSettingsDocument = HydratedDocument<AdminSetting>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class AdminSetting {
  @Prop(
    raw({
      appointment_fee: { type: Number, required: true, default: 1000 },
      payment_provider: {
        type: String,
        enum: {
          values: [
            PaymentProvider.PAYSTACK,
            PaymentProvider.FLUTTERWAVE,
            PaymentProvider.STRIPE,
          ],
        },
        required: true,
        default: PaymentProvider.PAYSTACK,
      },
    }),
  )
  defaults: AdminDefaultSettingsTypes;
}
export const AdminSettingSchema = SchemaFactory.createForClass(AdminSetting);
