import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { PatientAnalyticsDto } from '../patients/dto/patient-analytics.dto';
import { AppointmentsAnalyticsDto } from '../appointments/dto/appointments-analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('patients')
  async getPatientsAnalyticsData() {
    const result = await this.analyticsService.getPatientsAnalyticsData();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get('patients-graph')
  async getPatientsAnalyticsGraphData(
    @Query() patientAnalyticsDto: PatientAnalyticsDto,
  ) {
    const result = await this.analyticsService.getPatientsAnalyticsGraphData(
      patientAnalyticsDto,
    );
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get('appointments')
  async getAppointmentsAnalyticsData() {
    const result = await this.analyticsService.getAppointmentsAnalyticsData();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get('appointments-graph')
  async getAppointmentsAnalyticsGraphData(
    @Query() appointmentsAnalyticsDto: AppointmentsAnalyticsDto,
  ) {
    const result =
      await this.analyticsService.getAppointmentsAnalyticsGraphData(
        appointmentsAnalyticsDto,
      );
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }
}
