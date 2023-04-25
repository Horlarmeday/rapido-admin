import {
  Controller,
  Get,
  Body, UseGuards
} from "@nestjs/common";
import { DashboardService } from './dashboard.service';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { QueryIntervalDto } from '../patients/dto/query-interval.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('specialists')
  async getSpecialistAnalytics() {
    const result = await this.dashboardService.dashboardSpecialistAnalytics();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get('patients')
  async getPatientAnalytics(@Body() queryIntervalDto: QueryIntervalDto) {
    const result = await this.dashboardService.dashboardPatientAnalytics(
      queryIntervalDto,
    );
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }
}
