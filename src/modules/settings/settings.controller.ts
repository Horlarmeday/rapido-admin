import { Controller, Get, Post, Body, Patch, UseGuards, Param, Delete } from "@nestjs/common";
import { SettingsService } from './settings.service';
import { UpdateAdminSettingDto } from './dto/update-admin-setting.dto';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { AddRateDto } from './dto/add-rate.dto';
import { Types } from "mongoose";
import { UpdateRateDto } from "./dto/update-rate.dto";

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

  @Get('rate')
  async getRates() {
    const result = await this.adminSettingsService.getRates();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Post('rate')
  async addRate(@Body() addRateDto: AddRateDto) {
    const result = await this.adminSettingsService.addRate(addRateDto);
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Patch('rate')
  async updateRate(@Body() updateRateDto: UpdateRateDto) {
    const result = await this.adminSettingsService.updateRate(updateRateDto);
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Delete(':id')
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
}
