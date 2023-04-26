import { Injectable } from '@nestjs/common';
import { create, findById, findOne } from '../../common/crud/crud';
import { Admin, AdminDocument } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly generalHelpers: GeneralHelpers,
  ) {}

  async createAdminAccount(createUserDto: CreateUserDto) {
    const admin = await create(this.adminModel, {
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
      phone: {
        country_code: createUserDto.country_code,
        number: createUserDto.phone,
      },
    });
    return UsersService.excludeFields(admin);
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

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private static excludeFields(admin: AdminDocument) {
    const serializedUser = admin.toJSON() as Partial<Admin>;
    delete serializedUser?.password;
    return serializedUser;
  }
}
