import { Injectable, Logger } from '@nestjs/common';
import { UpdateAdminSettingDto } from './dto/update-admin-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdminSetting, AdminSettingsDocument } from './entities/setting.entity';
import {
  create,
  find,
  findOne,
  updateOne,
  updateOneAndReturn,
  upsert,
} from '../../common/crud/crud';
import { AddRateDto } from './dto/add-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectModel(AdminSetting.name)
    private adminSettingModel: Model<AdminSettingsDocument>,
  ) {}
  async create() {
    return create(this.adminSettingModel, {});
  }

  async findOrCreate() {
    const setting = await this.findOne();
    if (!setting) {
      this.logger.warn('No admin setting found, creating one...');
      return await this.create();
    }
  }

  async updateDefaults(updateAdminSettingDto: UpdateAdminSettingDto) {
    const settings = await findOne(this.adminSettingModel, {});
    return await updateOneAndReturn(
      this.adminSettingModel,
      { _id: updateAdminSettingDto._id },
      {
        defaults: {
          ...settings.defaults,
          ...updateAdminSettingDto.defaults,
        },
      },
    );
  }

  async findOne(): Promise<AdminSettingsDocument> {
    return await findOne(this.adminSettingModel, {});
  }

  async addRate(addRateDto: AddRateDto) {
    return await upsert(
      this.adminSettingModel,
      { _id: addRateDto.settingId },
      { $addToSet: { specialist_rates: { $each: [addRateDto] } } },
    );
  }

  async updateRate(updateRateDto: UpdateRateDto) {
    const { rateId, specialistRate } = updateRateDto;
    return await updateOneAndReturn(
      this.adminSettingModel,
      { 'specialist_rates._id': rateId },
      { 'specialist_rates.$': specialistRate },
    );
  }

  async getRates() {
    return findOne(
      this.adminSettingModel,
      {},
      { selectFields: 'specialist_rates' },
    );
  }

  async deleteRate(rateId: Types.ObjectId) {
    return await upsert(
      this.adminSettingModel,
      {},
      {
        $pull: { specialist_rates: { _id: rateId } },
      },
    );
  }
}
