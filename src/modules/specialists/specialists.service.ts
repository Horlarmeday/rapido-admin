import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../patients/entities/patient.entity';
import { SpecialistAdvancedFilterDto } from './dto/specialist-advanced-filter.dto';
import { PatientsService } from '../patients/patients.service';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { UserType } from '../users/types/profile.types';
import {
  aggregateDataPerDay,
  aggregateDataPerMonth,
  aggregateDataPerWeek,
  aggregateDataPerYear,
  countDocuments,
  find,
  findAndCountAll,
} from '../../common/crud/crud';
import { WalletDocument } from './entities/wallet.entity';
import { AppointmentsService } from '../appointments/appointments.service';
import {
  TransactionType,
  WalletTransaction,
  WalletTransactionDocument,
} from './entities/wallet-transactions.entity';
import * as moment from 'moment/moment';
import { SpecialistCategories } from './types/specialists.types';
import { Interval } from '../patients/dto/query-interval.dto';
import { isArray } from 'class-validator';
import {
  SpecialistAnalyticsFilter,
  SpecialistsAnalyticsDto,
} from './dto/specialists-analytics.dto';

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
      ...(status && status === 'All' ? {} : { verification_status: status }),
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
      options: { selectFields: this.getSelectedFields() },
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
      options: { selectFields: this.getSelectedFields() },
    })) as UserDocument[];
    return {
      specialists,
      count: await countDocuments(this.userModel, { ...query }),
    };
  }

  async getSpecialistEarnings(userId: Types.ObjectId) {
    const [earnings, withdrawals] = await Promise.all([
      find(this.walletTxnModel, {
        type: TransactionType.CREDIT,
        userId,
      }),
      find(this.walletTxnModel, {
        type: TransactionType.DEBIT,
        userId,
      }),
    ]);
    return {
      totalEarnings: earnings.reduce(
        (prevVal, currVal) => prevVal + currVal.amount,
        0,
      ),
      totalWithdrawals: withdrawals.reduce(
        (prevVal, currVal) => prevVal + currVal.amount,
        0,
      ),
    };
  }

  async getSpecialist(userId: Types.ObjectId) {
    const user = await this.patientsService.findOne({ _id: userId });
    const [transactions, appointments, earnings] = await Promise.all([
      this.getWalletTransactions(userId),
      this.appointmentService.getSpecialistAppointments(userId, {}),
      this.getSpecialistEarnings(userId),
    ]);
    return { user, transactions, appointments, earnings };
  }

  async getWalletTransactions(userId: Types.ObjectId) {
    return (await find(this.walletTxnModel, {
      userId,
    })) as WalletDocument[];
  }

  getSelectedFields() {
    return [
      '-profile.password',
      '-profile.twoFA_secret',
      '-emergency_contacts',
      '-pre_existing_conditions',
      '-dependants',
    ];
  }

  async analyticsData() {
    const [
      totalSpecialists,
      totalDoctors,
      totalTherapists,
      totalPharmacists,
      totalSpecialistsYesterday,
      totalDoctorsYesterday,
      totalTherapistsYesterday,
      totalPharmacistsYesterday,
    ] = await Promise.all([
      countDocuments(this.userModel, {
        user_type: UserType.SPECIALIST,
      }),
      countDocuments(this.userModel, {
        user_type: UserType.SPECIALIST,
        'professional_practice.category': SpecialistCategories.MEDICAL_DOCTOR,
      }),
      countDocuments(this.userModel, {
        user_type: UserType.SPECIALIST,
        'professional_practice.category': SpecialistCategories.THERAPIST,
      }),
      countDocuments(this.userModel, {
        user_type: UserType.SPECIALIST,
        'professional_practice.category': SpecialistCategories.PHARMACIST,
      }),
      countDocuments(this.userModel, {
        user_type: UserType.SPECIALIST,
        created_at: {
          $gte: moment().subtract(1, 'day').startOf('day').toDate(),
          $lte: moment().subtract(1, 'day').endOf('day').toDate(),
        },
      }),
      countDocuments(this.userModel, {
        user_type: UserType.SPECIALIST,
        'professional_practice.category': SpecialistCategories.MEDICAL_DOCTOR,
        created_at: {
          $gte: moment().subtract(1, 'day').startOf('day').toDate(),
          $lte: moment().subtract(1, 'day').endOf('day').toDate(),
        },
      }),
      countDocuments(this.userModel, {
        user_type: UserType.SPECIALIST,
        'professional_practice.category': SpecialistCategories.THERAPIST,
        created_at: {
          $gte: moment().subtract(1, 'day').startOf('day').toDate(),
          $lte: moment().subtract(1, 'day').endOf('day').toDate(),
        },
      }),
      countDocuments(this.userModel, {
        user_type: UserType.SPECIALIST,
        'professional_practice.category': SpecialistCategories.PHARMACIST,
        created_at: {
          $gte: moment().subtract(1, 'day').startOf('day').toDate(),
          $lte: moment().subtract(1, 'day').endOf('day').toDate(),
        },
      }),
    ]);
    return {
      totalSpecialists,
      totalDoctors,
      totalTherapists,
      totalPharmacists,
      totalSpecialistsYesterday,
      totalDoctorsYesterday,
      totalTherapistsYesterday,
      totalPharmacistsYesterday,
    };
  }

  async analyticsGraphData(specialistsAnalyticsDto: SpecialistsAnalyticsDto) {
    let { start_date, end_date } = specialistsAnalyticsDto;
    const { interval, filter } = specialistsAnalyticsDto;

    switch (interval) {
      case Interval.DAY: {
        if (!start_date)
          start_date = moment().subtract(2, 'month').startOf('month').toDate();
        if (!end_date) end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) => {
              return aggregateDataPerDay(this.userModel, {
                created_at: {
                  $gte: moment(start_date).toDate(),
                  $lt: moment(end_date).toDate(),
                },
                ...this.filterQuery(fil),
                user_type: UserType.SPECIALIST,
              });
            }),
          );
          return {
            interval,
            data: filter.map((fil, index) => ({
              filter: fil,
              data: data[index],
            })),
          };
        }
        return {
          interval,
          data: {
            filter,
            data: await aggregateDataPerDay(this.userModel, {
              created_at: {
                $gte: moment(start_date).toDate(),
                $lt: moment(end_date).toDate(),
              },
              ...this.filterQuery(filter),
              user_type: UserType.SPECIALIST,
            }),
          },
        };
      }
      case Interval.WEEK: {
        if (!start_date)
          start_date = moment().subtract(3, 'month').startOf('month').toDate();
        if (!end_date) end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) => {
              return aggregateDataPerWeek(this.userModel, {
                created_at: {
                  $gte: moment(start_date).toDate(),
                  $lt: moment(end_date).toDate(),
                },
                ...this.filterQuery(fil),
                user_type: UserType.SPECIALIST,
              });
            }),
          );
          return {
            interval,
            data: filter.map((fil, index) => ({
              filter: fil,
              data: data[index],
            })),
          };
        }
        return {
          interval,
          data: {
            filter,
            data: await aggregateDataPerWeek(this.userModel, {
              created_at: {
                $gte: moment(start_date).toDate(),
                $lt: moment(end_date).toDate(),
              },
              ...this.filterQuery(filter),
              user_type: UserType.SPECIALIST,
            }),
          },
        };
      }
      case Interval.MONTH: {
        if (!start_date) start_date = moment().subtract(8, 'month').toDate();
        if (!end_date) end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) => {
              return aggregateDataPerMonth(this.userModel, {
                ...this.filterQuery(fil),
                created_at: {
                  $gte: moment(start_date).toDate(),
                  $lt: moment(end_date).toDate(),
                },
                user_type: UserType.SPECIALIST,
              });
            }),
          );
          return {
            interval,
            data: filter.map((fil, index) => ({
              filter: fil,
              data: data[index],
            })),
          };
        }
        return {
          interval,
          data: {
            filter,
            data: await aggregateDataPerMonth(this.userModel, {
              ...this.filterQuery(filter),
              created_at: {
                $gte: moment(start_date).toDate(),
                $lt: moment(end_date).toDate(),
              },
              user_type: UserType.SPECIALIST,
            }),
          },
        };
      }
      case Interval.YEAR: {
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) => {
              return aggregateDataPerYear(this.userModel, {
                user_type: UserType.SPECIALIST,
                ...this.filterQuery(fil),
              });
            }),
          );
          return {
            interval,
            data: filter.map((fil, index) => ({
              filter: fil,
              data: data[index],
            })),
          };
        }
        return {
          interval,
          data: {
            filter,
            data: await aggregateDataPerYear(this.userModel, {
              user_type: UserType.SPECIALIST,
              ...this.filterQuery(filter),
            }),
          },
        };
      }
      default: {
        start_date = moment().subtract(2, 'month').startOf('month').toDate();
        end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) => {
              return aggregateDataPerDay(this.userModel, {
                created_at: {
                  $gte: moment(start_date).toDate(),
                  $lt: moment(end_date).toDate(),
                },
                ...this.filterQuery(fil),
                user_type: UserType.SPECIALIST,
              });
            }),
          );
          return {
            interval,
            data: filter.map((fil, index) => ({
              filter: fil,
              data: data[index],
            })),
          };
        }
        return {
          interval,
          data: {
            filter,
            data: await aggregateDataPerDay(this.userModel, {
              created_at: {
                $gte: moment(start_date).toDate(),
                $lt: moment(end_date).toDate(),
              },
              ...this.filterQuery(filter),
              user_type: UserType.SPECIALIST,
            }),
          },
        };
      }
    }
  }

  private filterQuery(filter: SpecialistAnalyticsFilter) {
    switch (filter) {
      case SpecialistAnalyticsFilter.ALL:
        return {};
      case SpecialistAnalyticsFilter.MEDICAL_DOCTOR:
        return {
          'professional_practice.category': SpecialistCategories.MEDICAL_DOCTOR,
        };
      case SpecialistAnalyticsFilter.PHARMACIST:
        return {
          'professional_practice.category': SpecialistCategories.PHARMACIST,
        };
      case SpecialistAnalyticsFilter.THERAPIST:
        return {
          'professional_practice.category': SpecialistCategories.THERAPIST,
        };
      default:
        return {};
    }
  }
}
