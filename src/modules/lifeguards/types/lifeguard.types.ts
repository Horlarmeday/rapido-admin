import { Types } from 'mongoose';

export class LifeguardPreferences {
  age_range: string;
  gender: string;
  location: string;
  treatment_class: string;
  donation_type: string;
  amount_donated: string;
}

export class CardDetails {
  _id?: Types.ObjectId;
  auth_code: string;
  last4Digit: string;
  expiry: Date;
  issuer: string;
  card_type: string;
  agent: string;
  currency: string;
  is_default: boolean;
}