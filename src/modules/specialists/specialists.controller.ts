import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { SpecialistsService } from './specialists.service';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { SpecialistAdvancedFilterDto } from './dto/specialist-advanced-filter.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  @Get()
  async getSpecialists(
    @Query() specialistAdvancedFilterDto: SpecialistAdvancedFilterDto,
  ) {
    const result = await this.specialistsService.getSpecialists(
      specialistAdvancedFilterDto,
    );
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get(':id')
  async getSpecialist(@Param('id') id: Types.ObjectId) {
    const result = await this.specialistsService.getSpecialist(id);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }
}
