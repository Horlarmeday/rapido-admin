import { Interval } from "../../patients/dto/query-interval.dto";
import { PatientsAnalyticsFilter } from "../../patients/dto/patient-analytics.dto";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export enum AppointmentAnalyticsFilter {
  ALL = 'All',
  CANCELLED_APPOINTMENTS = 'Cancelled Appointments',
  COMPLETED_APPOINTMENTS = 'Completed Appointments',
}
export class AppointmentsAnalyticsDto {
  @IsOptional()
  start_date: Date;

  @IsOptional()
  end_date: Date;

  @IsNotEmpty()
  @IsEnum(Interval)
  interval: Interval;

  @IsNotEmpty()
  filter: AppointmentAnalyticsFilter | AppointmentAnalyticsFilter[];
}