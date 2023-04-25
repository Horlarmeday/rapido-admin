import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  @Get()
  async getAppointments(@Query() appointmentsQueryDto: AppointmentsQueryDto) {
    const result = await this.appointmentsService.getAppointments(
      appointmentsQueryDto,
    );
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }
}
