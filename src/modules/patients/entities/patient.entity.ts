import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as moment from 'moment';

export type UserDocument = HydratedDocument<User>;

export enum UserType {
  PATIENT = 'Patient',
  SPECIALIST = 'Specialist',
}

export enum ProfileStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  CANCELLED = 'Cancelled',
  SUSPENDED = 'Suspended',
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { getters: true, virtuals: true },
})
export class User {
  @Prop(
    raw({
      first_name: { type: String, required: true, minLength: 3, trim: true },
      last_name: { type: String, required: true, minLength: 3, trim: true },
      gender: {
        required: false,
        type: String,
      },
      date_of_birth: {
        required: false,
        type: Date,
        get: (v) => moment(v).format('YYYY-MM-DD'),
      },
      password: {
        required: false,
        type: String,
      },
      marital_status: {
        type: String,
      },
      contact: {
        email: {
          required: true,
          type: String,
          trim: true,
          lowercase: true,
          unique: true,
        },
        phone: {
          country_code: { type: String, required: false },
          number: {
            type: String,
            required: false,
            minLength: 10,
            maxLength: 10,
            unique: true,
            sparse: true,
          },
        },
        address1: { type: String },
        address2: { type: String },
        state: { type: String },
        country: { type: String },
        zip_code: { type: String },
      },
      basic_health_info: {
        height: {
          value: { type: Number },
          unit: { type: String },
        },
        weight: {
          value: { type: Number },
          unit: { type: String },
        },
      },
      health_risk_factors: {
        is_smoker: { type: String },
        weight_status: { type: String },
        has_recent_injuries: { type: String },
      },
      twoFA_secret: { type: String, required: false },
      profile_photo: { type: String, required: false },
    }),
  )
  profile: any;

  @Prop({
    required: true,
    type: String,
    default: UserType.PATIENT,
    enum: {
      values: [UserType.PATIENT, UserType.SPECIALIST],
      message: '{VALUE} is not supported',
    },
  })
  user_type: UserType;

  @Prop({ type: Boolean, default: false })
  terms: boolean;

  @Prop({ type: Boolean, default: false })
  marketing: boolean;

  @Prop({ type: Boolean, default: false })
  is_email_verified: boolean;

  @Prop({ type: Date })
  email_verified_at: Date;

  @Prop({ type: Boolean, default: false })
  is_phone_verified: boolean;

  @Prop({ type: Boolean, default: false })
  is_auth_app_enabled: boolean;

  @Prop({ type: Date })
  phone_verified_at: Date;

  @Prop({
    required: true,
    type: String,
  })
  reg_medium: any;

  @Prop(
    raw([
      {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        phone: {
          country_code: { type: String, required: false },
          number: {
            type: String,
            required: false,
            minLength: 10,
            maxLength: 10,
          },
        },
        address1: { type: String },
        address2: { type: String },
        relationship: {
          type: String,
        },
        zip_code: { type: String },
        state: { type: String },
        country: { type: String },
      },
    ]),
  )
  emergency_contacts?: any[];

  @Prop(
    raw([
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        start_date: { type: Date, get: (v) => moment(v).format('YYYY-MM-DD') },
        end_date: { type: Date, get: (v) => moment(v).format('YYYY-MM-DD') },
        is_condition_exists: { type: Boolean, default: false },
        file: [
          {
            file_type: { type: String },
            original_name: { type: String },
            url: { type: String },
          },
        ],
      },
    ]),
  )
  pre_existing_conditions?: any[];

  @Prop(
    raw([
      {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        contact: {
          phone: {
            country_code: { type: String, required: false },
            number: {
              type: String,
              required: false,
              minLength: 10,
              maxLength: 10,
            },
          },
          email: { type: String },
          address1: { type: String },
          address2: { type: String },
          state: { type: String },
          country: { type: String },
          zip_code: { type: String },
        },
        basic_health_info: {
          height: {
            value: { type: Number },
            unit: { type: String },
          },
          weight: {
            value: { type: Number },
            unit: { type: String },
          },
        },
        date_of_birth: {
          type: Date,
          get: (v) => moment(v).format('YYYY-MM-DD'),
        },
        gender: {
          type: String,
        },
        relationship: {
          type: String,
          enum: {
            message: '{VALUE} is not supported',
          },
        },
      },
    ]),
  )
  dependants?: any[];
  full_name: string;

  @Prop(
    raw({
      plan_name: { type: String },
      planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
      updatedAt: { type: Date, default: new Date() },
    }),
  )
  plan: any;

  @Prop(
    raw({
      category: { type: String },
      area_of_specialty: { type: String },
      university: {
        name: { type: String },
        start_year: { type: String },
        end_year: { type: String },
      },
      place_of_housemanship: {
        name: { type: String },
        start_year: { type: Date },
        end_year: { type: Date },
      },
      license_number: { type: String },
      years_of_practice: { type: String },
    }),
  )
  professional_practice?: any;

  @Prop(
    raw([
      {
        type_of_document: { type: String },
        url: { type: String },
        file_type: { type: String },
        original_name: { type: String },
      },
    ]),
  )
  documents: any[];

  @Prop(
    raw([
      {
        title: { type: String },
        description: { type: String },
        date: { type: String },
        file: [
          {
            file_type: { type: String },
            original_name: { type: String },
            url: { type: String },
          },
        ],
      },
    ]),
  )
  awards: any[];

  @Prop({ type: String, default: 0 })
  earnings: string;

  @Prop({ type: Number, default: 0 })
  average_rating: number;

  @Prop({
    type: String,
  })
  verification_status: any;

  @Prop({
    type: String,
  })
  status: ProfileStatus;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({
  'profile.first_name': 'text',
  'profile.last_name': 'text',
  'profile.contact.email': 'text',
  'professional_practice.category': 'text',
  'profile.gender': 'text',
  user_type: 'text',
});
export { UserSchema };
