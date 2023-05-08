import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Types } from "mongoose";

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  async create(@Body() createPlanDto: CreatePlanDto) {
    const result = await this.plansService.createPlan(createPlanDto);
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Get()
  async findPlans() {
    const result = await this.plansService.findPlans();
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Get(':id')
  async findOnePlan(@Param('id') id: Types.ObjectId) {
    const result = await this.plansService.findOnePlan(id);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    const result = await this.plansService.updatePlan(id, updatePlanDto);
    return sendSuccessResponse(Messages.UPDATED, result);
  }
}
