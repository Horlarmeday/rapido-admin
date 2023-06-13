import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateAdminSettingDto } from './dto/update-admin-setting.dto';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { AddRateDto } from './dto/add-rate.dto';
import { Types } from 'mongoose';
import { UpdateRateDto } from './dto/update-rate.dto';
import { RateAdvancedFilterDto } from './dto/rate-advanced-filter.dto';
import { UpdateSplitRatioDto } from './dto/update-split-ratio.dto';
import { AddSplitRatioDto } from './dto/add-split-ratio.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly adminSettingsService: SettingsService) {}

  @Post()
  async create() {
    const result = await this.adminSettingsService.create();
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Get()
  async findOne() {
    const result = await this.adminSettingsService.findOne();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get('rates')
  async getRates(@Query() rateAdvancedFilterDto: RateAdvancedFilterDto) {
    const result = await this.adminSettingsService.getRates(
      rateAdvancedFilterDto,
    );
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Post('rates')
  async addRate(@Body() addRateDto: AddRateDto) {
    const result = await this.adminSettingsService.addRate(addRateDto);
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Patch('rates')
  async updateRate(@Body() updateRateDto: UpdateRateDto) {
    const result = await this.adminSettingsService.updateRate(updateRateDto);
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Delete('rates/:id')
  async removeRate(@Param('id') id: Types.ObjectId) {
    const result = await this.adminSettingsService.deleteRate(id);
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Patch()
  async updateDefaults(@Body() updateAdminSettingDto: UpdateAdminSettingDto) {
    const result = await this.adminSettingsService.updateDefaults(
      updateAdminSettingDto,
    );
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Get('split-ratio')
  async getSplitRatio() {
    const result = await this.adminSettingsService.getSplitRatio();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Post('split-ratio')
  async addSplitRatio(@Body() addSplitRatioDto: AddSplitRatioDto) {
    const result = await this.adminSettingsService.addSplitRatio(
      addSplitRatioDto,
    );
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Patch('split-ratio')
  async updateSplitRatio(@Body() updateSplitRatioDto: UpdateSplitRatioDto) {
    const result = await this.adminSettingsService.updateSplitRatio(
      updateSplitRatioDto,
    );
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Delete('split-ratio/:id')
  async removeSplitRatio(@Param('id') id: Types.ObjectId) {
    const result = await this.adminSettingsService.deleteSplitRatio(id);
    return sendSuccessResponse(Messages.DELETED, result);
  }
}
