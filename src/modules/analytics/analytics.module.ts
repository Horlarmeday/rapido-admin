import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PatientsModule } from "../patients/patients.module";
import { AppointmentsModule } from "../appointments/appointments.module";

@Module({
  imports: [PatientsModule, AppointmentsModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
