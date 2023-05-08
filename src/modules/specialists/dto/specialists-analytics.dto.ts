import { Interval } from "../../patients/dto/query-interval.dto";

export enum SpecialistAnalyticsFilter {
  ALL = 'All',
  MEDICAL_DOCTOR = 'Medical Doctor',
  THERAPIST = 'Therapist',
  PHARMACIST = 'Pharmacist'
}

export class SpecialistsAnalyticsDto {
  start_date: Date;
  end_date: Date;
  interval: Interval;
  filter: SpecialistAnalyticsFilter | SpecialistAnalyticsFilter[];
}