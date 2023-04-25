import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

export enum MeetingType {
  AUDIO = 'Audio only',
  VIDEO_AUDIO = 'Video and audio',
}

export enum AppointmentStatus {
  COMPLETED = 'COMPLETED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  ONGOING = 'ONGOING',
}

export enum Status {
  SUCCESSFUL = 'SUCCESSFUL',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Appointment {
  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Date, required: true })
  start_time: Date;

  @Prop({ type: String })
  timezone: string;

  @Prop({ type: String, required: true })
  appointment_type: string;

  @Prop(
    raw({
      time_taken: { type: Number, default: 0 },
      unit: { type: String, default: 'Minutes' },
    }),
  )
  call_duration: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  patient: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Referral' })
  referral: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  specialist: Types.ObjectId;

  @Prop({ type: String })
  join_url: string;

  @Prop({ type: String })
  start_url: string;

  @Prop({ type: String })
  meeting_id: string;

  @Prop({ type: String })
  meeting_class: string;

  @Prop({
    type: String,
    enum: { values: [Status.SUCCESSFUL, Status.FAILED, Status.PENDING] },
    default: Status.PENDING,
  })
  payment_status: Status;

  @Prop({
    type: String,
    enum: {
      values: [
        AppointmentStatus.CLOSED,
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.FAILED,
        AppointmentStatus.OPEN,
        AppointmentStatus.ONGOING,
      ],
    },
    default: AppointmentStatus.OPEN,
  })
  status: AppointmentStatus;

  @Prop({
    type: String,
    enum: {
      values: [MeetingType.AUDIO, MeetingType.VIDEO_AUDIO],
    },
    default: MeetingType.VIDEO_AUDIO,
  })
  meeting_type: MeetingType;

  @Prop(
    raw([
      {
        content: { type: String },
        createdAt: { type: Date, default: new Date() },
      },
    ]),
  )
  notes: string[];
}
const AppointmentSchema = SchemaFactory.createForClass(Appointment);
AppointmentSchema.pre('find', function (next) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (this?.options._recursed) {
    return next();
  }
  this.populate({
    path: 'specialist patient',
    options: { _recursed: true },
    select: 'profile.first_name profile.last_name',
  });
  next();
});

export { AppointmentSchema };