import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CardDetails, LifeguardPreferences } from '../types/lifeguard.types';
import * as moment from 'moment/moment';
import { Status } from '../../appointments/entities/appointment.entity';

export type LifeguardDocument = HydratedDocument<Lifeguard>;

export enum RegMedium {
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  LOCAL = 'LOCAL',
}

export enum ProfileStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  CANCELLED = 'Cancelled',
  SUSPENDED = 'Suspended',
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Lifeguard {
  @Prop({ type: String, required: true, trim: true })
  first_name: string;

  @Prop({ type: String, required: true, trim: true })
  last_name: string;

  @Prop(
    raw({
      country_code: { type: String, required: true },
      number: {
        type: String,
        required: false,
        minLength: 10,
        maxLength: 10,
        unique: true,
        sparse: true,
      },
    }),
  )
  phone: string;

  @Prop({
    required: false,
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({
    required: true,
    type: String,
    default: RegMedium.LOCAL,
    enum: {
      values: [RegMedium.APPLE, RegMedium.GOOGLE, RegMedium.LOCAL],
      message: '{VALUE} is not supported',
    },
  })
  reg_medium: RegMedium;

  @Prop({ type: Boolean, default: false })
  is_email_verified: boolean;

  @Prop({ type: Date })
  email_verified_at: Date;

  @Prop({
    type: String,
    enum: {
      values: [
        ProfileStatus.ACTIVE,
        ProfileStatus.CANCELLED,
        ProfileStatus.INACTIVE,
        ProfileStatus.SUSPENDED,
      ],
    },
    default: ProfileStatus.ACTIVE,
  })
  status: ProfileStatus;

  @Prop(
    raw({
      address1: { type: String },
      address2: { type: String },
      state: { type: String },
      country: { type: String },
      zip_code: { type: String },
    }),
  )
  address: any;

  @Prop(
    raw([
      {
        auth_code: { type: String },
        last4Digit: { type: String },
        expiry: { type: Date },
        issuer: { type: String },
        card_type: { type: String },
        agent: { type: String },
        currency: { type: String },
        is_default: { type: Boolean, default: false },
      },
    ]),
  )
  card_details: CardDetails[];

  @Prop(
    raw([
      {
        age_range: { type: String },
        gender: { type: String },
        location: { type: Date },
        treatment_class: { type: String },
        donation_type: { type: String },
        amount_donated: { type: String },
        payment_status: {
          type: String,
          enum: { values: [Status.PENDING, Status.FAILED, Status.SUCCESSFUL] },
          default: Status.PENDING,
        },
      },
    ]),
  )
  preferences: LifeguardPreferences[];

  @Prop(
    raw({
      code: { type: String },
      expiration: { type: Date, default: moment().add(4, 'hour').toDate() },
    }),
  )
  token: any;
}
const LifeguardSchema = SchemaFactory.createForClass(Lifeguard);

LifeguardSchema.index({
  first_name: 'text',
  last_name: 'text',
  email: 'text',
  status: 'text',
});

export { LifeguardSchema };
