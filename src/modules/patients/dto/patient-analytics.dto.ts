import { Interval } from './query-interval.dto';
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
export enum PatientsAnalyticsFilter {
  ALL = 'All',
  WITH_SUBSCRIPTION = 'With Subscription',
  WITHOUT_SUBSCRIPTION = 'Without Subscription',
}

export class PatientAnalyticsDto {
  @IsOptional()
  start_date: Date;

  @IsOptional()
  end_date: Date;

  @IsNotEmpty()
  @IsEnum(Interval)
  interval: Interval;

  @IsNotEmpty()
  filter: PatientsAnalyticsFilter | PatientsAnalyticsFilter[];
}
