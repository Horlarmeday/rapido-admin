import { Injectable } from '@nestjs/common';
import { create, findById, findOne } from '../../common/crud/crud';
import { Admin, AdminDocument } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly generalHelpers: GeneralHelpers,
  ) {}

  async createAdminAccount(createUserDto: CreateUserDto) {
    return await create(this.adminModel, {
      ...createUserDto,
      phone: {
        country_code: createUserDto.country_code,
        number: createUserDto.phone,
      },
    });
  }

  async findById(id: Types.ObjectId): Promise<AdminDocument> {
    return await findById(this.adminModel, id);
  }
  async findOneByEmail(email: string): Promise<AdminDocument> {
    return await findOne(this.adminModel, { email });
  }

  async findOneByEmailOrPhone(email: string, phone: string): Promise<Admin> {
    return await findOne(this.adminModel, {
      $or: [
        {
          email: email || '',
        },
        {
          'phone.number': phone || '',
        },
      ],
    });
  }
}
