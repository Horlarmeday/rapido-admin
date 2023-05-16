import { AppointmentStatus, MeetingType } from '../entities/appointment.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class AppointmentsQueryDto {
  @IsNotEmpty()
  currentPage: number;

  @IsOptional()
  pageLimit: number;

  @IsNotEmpty()
  @IsString()
  status: AppointmentStatus | string;

  @ValidateIf((o) => o.medium !== undefined)
  @IsEnum(MeetingType)
  medium: MeetingType;

  @IsOptional()
  date: Date;

  @IsOptional()
  meeting_class: string;
}
