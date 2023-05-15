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
import { PatientsService } from './patients.service';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { PatientAdvancedFilterDto } from './dto/patient-advanced-filter.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async getPatients(
    @Query() patientAdvancedFilterDto: PatientAdvancedFilterDto,
  ) {
    const result = await this.patientsService.getPatients(
      patientAdvancedFilterDto,
    );
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get('countries')
  async getCountries() {
    const result = await this.patientsService.getCountries();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get(':id')
  async getPatient(@Param('id') id: Types.ObjectId) {
    const result = await this.patientsService.getPatient(id);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }


}
