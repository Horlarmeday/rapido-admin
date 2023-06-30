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
import { LifeguardsService } from './lifeguards.service';
import { LifeguardFilterDto } from './dto/lifeguard-filter.dto';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { Types } from 'mongoose';

@Controller('lifeguards')
export class LifeguardsController {
  constructor(private readonly lifeguardsService: LifeguardsService) {}
  @Get()
  async getLifeguards(@Query() lifeguardFilterDto: LifeguardFilterDto) {
    const result = await this.lifeguardsService.getLifeguards(
      lifeguardFilterDto,
    );
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get(':id')
  async getLifeguard(@Param('id') id: Types.ObjectId) {
    const result = await this.lifeguardsService.getOneLifeguard(id);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }
}
