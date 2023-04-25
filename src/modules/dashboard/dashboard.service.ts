import { Injectable } from '@nestjs/common';
import { QueryIntervalDto } from '../patients/dto/query-interval.dto';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class DashboardService {
  constructor(private readonly patientsService: PatientsService) {}
  async dashboardSpecialistAnalytics() {
    return await this.patientsService.dashboardSpecialistAnalytics();
  }

  async dashboardPatientAnalytics(queryIntervalDto: QueryIntervalDto) {
    return await this.patientsService.dashboardPatientAnalytics(
      queryIntervalDto,
    );
  }
}
