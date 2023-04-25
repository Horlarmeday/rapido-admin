export enum PaymentProvider {
  PAYSTACK = 'Paystack',
  FLUTTERWAVE = 'Flutterwave',
  STRIPE = 'Stripe',
}

export class AdminDefaultSettingsTypes {
  appointment_fee: number;
  payment_provider: PaymentProvider;
}
