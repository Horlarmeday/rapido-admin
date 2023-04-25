import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../patients/entities/patient.entity';
import { SpecialistAdvancedFilterDto } from './dto/specialist-advanced-filter.dto';
import { PatientsService } from '../patients/patients.service';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { UserType } from '../users/types/profile.types';
import { countDocuments, find, findAndCountAll } from '../../common/crud/crud';
import { WalletDocument } from './entities/wallet.entity';
import { AppointmentsService } from '../appointments/appointments.service';
import {
  WalletTransaction,
  WalletTransactionDocument,
} from './entities/wallet-transactions.entity';

@Injectable()
export class SpecialistsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(WalletTransaction.name)
    private walletTxnModel: Model<WalletTransactionDocument>,
    private readonly patientsService: PatientsService,
    private readonly generalHelpers: GeneralHelpers,
    private readonly appointmentService: AppointmentsService,
  ) {}

  async getSpecialists(
    specialistAdvancedFilterDto: SpecialistAdvancedFilterDto,
  ) {
    const {
      currentPage,
      gender,
      pageLimit,
      dateReg,
      search,
      country,
      state,
      category,
      status,
    } = specialistAdvancedFilterDto;
    const { limit, offset } = this.generalHelpers.calcLimitAndOffset(
      +currentPage,
      pageLimit,
    );
    const query = {
      user_type: UserType.SPECIALIST,
      ...(gender && { 'profile.gender': gender }),
      ...(country && { 'profile.contact.country': country }),
      ...(state && { 'profile.contact.state': state }),
      ...(dateReg && {
        created_at: {
          $gte: new Date(new Date(dateReg).setHours(0, 0, 0)),
          $lte: new Date(new Date(dateReg).setHours(23, 59, 59)),
        },
      }),
      ...(status && { status }),
      ...(category && { 'professional_practice.category': category }),
    };
    let result: { specialists: UserDocument[]; count: number };

    if (search) {
      result = await this.searchSpecialists(limit, offset, search, query);
    } else {
      result = await this.querySpecialists(limit, offset, query);
    }

    return this.generalHelpers.paginate(
      result.specialists,
      +currentPage,
      limit,
      result.count,
    );
  }

  async searchSpecialists(
    limit: number,
    offset: number,
    search: string,
    query,
  ): Promise<{ specialists: UserDocument[]; count: number }> {
    const specialists = (await findAndCountAll({
      model: this.userModel,
      query,
      limit,
      offset,
      options: { selectFields: this.getSelectedFields(query.user_type) },
      displayScore: true,
    })) as UserDocument[];
    return {
      specialists,
      count: await countDocuments(this.userModel, { ...query }),
    };
  }

  async querySpecialists(
    limit: number,
    offset: number,
    query,
  ): Promise<{ specialists: UserDocument[]; count: number }> {
    const specialists = (await findAndCountAll({
      model: this.userModel,
      query,
      limit,
      offset,
      options: { selectFields: this.getSelectedFields(query.user_type) },
    })) as UserDocument[];
    return {
      specialists,
      count: await countDocuments(this.userModel, { ...query }),
    };
  }

  async getSpecialist(userId: Types.ObjectId) {
    const user = await this.patientsService.findOne({ _id: userId });
    const [transactions, appointments] = await Promise.all([
      this.getWalletTransactions(userId),
      this.appointmentService.getSpecialistAppointments(userId, {}),
    ]);
    return { ...user, transactions, appointments };
  }

  async getWalletTransactions(userId: Types.ObjectId) {
    return (await find(this.walletTxnModel, {
      userId,
    })) as WalletDocument[];
  }

  getSelectedFields(user_type: UserType) {
    if (user_type === UserType.SPECIALIST) {
      return [
        '-profile.password',
        '-profile.twoFA_secret',
        '-emergency_contacts',
        '-pre_existing_conditions',
        '-dependants',
      ];
    }
    return [
      '-profile.password',
      '-profile.twoFA_secret',
      '-documents',
      '-professional_practice',
      '-earnings',
      '-average_rating',
      '-verification_status',
      '-awards',
    ];
  }
}
