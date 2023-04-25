import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PatientsModule } from "../patients/patients.module";

@Module({
  imports: [PatientsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
