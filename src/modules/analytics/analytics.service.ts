import { Injectable } from '@nestjs/common';
import { PatientsService } from '../patients/patients.service';
import { PatientAnalyticsDto } from '../patients/dto/patient-analytics.dto';
import { AppointmentsService } from '../appointments/appointments.service';
import { AppointmentsAnalyticsDto } from '../appointments/dto/appointments-analytics.dto';
import { SpecialistsService } from "../specialists/specialists.service";
import { SpecialistsAnalyticsDto } from "../specialists/dto/specialists-analytics.dto";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly specialistsService: SpecialistsService,
  ) {}
  async getPatientsAnalyticsData() {
    return this.patientsService.analyticsData();
  }

  async getPatientsAnalyticsGraphData(
    patientAnalyticsDto: PatientAnalyticsDto,
  ) {
    return this.patientsService.analyticsGraphData(patientAnalyticsDto);
  }

  async getAppointmentsAnalyticsData() {
    return this.appointmentsService.analyticsData();
  }

  async getAppointmentsAnalyticsGraphData(
    appointmentsAnalyticsDto: AppointmentsAnalyticsDto,
  ) {
    return this.appointmentsService.analyticsGraphData(
      appointmentsAnalyticsDto,
    );
  }

  async getSpecialistsAnalyticsData() {
    return this.specialistsService.analyticsData();
  }

  async getSpecialistsAnalyticsGraphData(
    specialistsAnalyticsDto: SpecialistsAnalyticsDto,
  ) {
    return this.specialistsService.analyticsGraphData(specialistsAnalyticsDto);
  }
}
