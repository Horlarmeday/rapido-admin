import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateAdminSettingDto } from './dto/update-admin-setting.dto';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly adminSettingsService: SettingsService) {}

  @Post()
  async create() {
    const result = await this.adminSettingsService.create();
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Get()
  async findAll() {
    const result = await this.adminSettingsService.find();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get('one')
  async findOne() {
    const result = await this.adminSettingsService.findOne();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Patch()
  async update(@Body() updateAdminSettingDto: UpdateAdminSettingDto) {
    const result = await this.adminSettingsService.update(
      updateAdminSettingDto,
    );
    return sendSuccessResponse(Messages.UPDATED, result);
  }
}
