import { Types } from "mongoose";

export enum PaymentProvider {
  PAYSTACK = 'Paystack',
  FLUTTERWAVE = 'Flutterwave',
  STRIPE = 'Stripe',
}

export class Rate {
  number: number;
  unit: string;
}

export class SpecialistRate {
  _id?: Types.ObjectId;
  category: string;
  specialization: string;
  rate: Rate;
}

export class AdminDefaultSettingsTypes {
  payment_provider: PaymentProvider;
}

export class AdminSetting {
  defaults: AdminDefaultSettingsTypes;
  specialist_rates: SpecialistRate[];
}
