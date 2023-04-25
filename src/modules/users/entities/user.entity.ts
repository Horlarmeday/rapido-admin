import { AdminStatus, Role } from '../types/profile.types';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Admin {
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
      },
    }),
  )
  phone: string;

  @Prop({
    required: false,
    type: String,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({
    type: String,
    enum: {
      values: [AdminStatus.ACTIVE, AdminStatus.INACTIVE, AdminStatus.SUSPENDED],
    },
    default: AdminStatus.ACTIVE,
  })
  status: string;

  @Prop({
    type: String,
    enum: {
      values: [Role.ADMIN, Role.SUPER_ADMIN],
    },
    default: Role.SUPER_ADMIN,
  })
  role: Role;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
