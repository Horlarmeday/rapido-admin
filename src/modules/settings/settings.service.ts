import { Injectable } from '@nestjs/common';
import { UpdateAdminSettingDto } from './dto/update-admin-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AdminSetting,
  AdminSettingsDocument,
} from './entities/setting.entity';
import { create, find, findOne, updateOne } from '../../common/crud/crud';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(AdminSetting.name)
    private adminSettingModel: Model<AdminSettingsDocument>,
  ) {}
  async create() {
    return create(this.adminSettingModel, {});
  }

  async find() {
    return await find(this.adminSettingModel, {});
  }

  async update(updateAdminSettingDto: UpdateAdminSettingDto) {
    const settings = await findOne(this.adminSettingModel, {});
    return await updateOne(
      this.adminSettingModel,
      {},
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
}
