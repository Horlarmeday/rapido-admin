import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientAdvancedFilterDto } from './dto/patient-advanced-filter.dto';
import { UserType, VerificationStatus } from '../users/types/profile.types';
import { countDocuments, find, findAndCountAll } from '../../common/crud/crud';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/patient.entity';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { Messages } from '../../core/messages/messages';
import { findOne } from '../../common/crud/crud';
import {
  Subscription,
  SubscriptionDocument,
} from './entities/subscription.entity';
import { AppointmentsService } from '../appointments/appointments.service';
import { Interval, QueryIntervalDto } from './dto/query-interval.dto';
import * as moment from 'moment';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    private readonly generalHelpers: GeneralHelpers,
    private readonly appointmentService: AppointmentsService,
  ) {}

  async findOne(query: any): Promise<UserDocument> {
    const user = await findOne(this.userModel, query, {
      selectFields: ['-profile.password', '-profile.twoFA_secret'],
    });
    if (!user) throw new NotFoundException(Messages.NO_USER_FOUND);
    return user;
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

  async getPatients(patientAdvancedFilterDto: PatientAdvancedFilterDto) {
    const {
      currentPage,
      gender,
      pageLimit,
      dateReg,
      maxDependant,
      minDependant,
      search,
      country,
      state,
      plan,
    } = patientAdvancedFilterDto;
    const { limit, offset } = this.generalHelpers.calcLimitAndOffset(
      +currentPage,
      pageLimit,
    );
    const query = {
      user_type: UserType.PATIENT,
      ...(gender && { 'profile.gender': gender }),
      ...(country && { 'profile.contact.country': country }),
      ...(state && { 'profile.contact.state': state }),
      ...(dateReg && {
        created_at: {
          $gte: new Date(new Date(dateReg).setHours(0, 0, 0)),
          $lte: new Date(new Date(dateReg).setHours(23, 59, 59)),
        },
      }),
      ...(minDependant && { dependants: { $size: +minDependant } }),
      ...(maxDependant && { dependants: { $size: +maxDependant } }),
      ...(plan && { 'plan.plan_name': plan }),
    };
    let result: { patients: UserDocument[]; count: number };

    if (search) {
      result = await this.searchPatients(limit, offset, search, query);
    } else {
      result = await this.queryPatients(limit, offset, query);
    }

    return this.generalHelpers.paginate(
      result.patients,
      +currentPage,
      limit,
      result.count,
    );
  }

  async searchPatients(
    limit: number,
    offset: number,
    search: string,
    query,
  ): Promise<{ patients: UserDocument[]; count: number }> {
    const patients = (await findAndCountAll({
      model: this.userModel,
      query,
      limit,
      offset,
      options: { selectFields: this.getSelectedFields(query.user_type) },
      displayScore: true,
    })) as UserDocument[];
    return {
      patients,
      count: await countDocuments(this.userModel, { ...query }),
    };
  }

  async queryPatients(
    limit: number,
    offset: number,
    query,
  ): Promise<{ patients: UserDocument[]; count: number }> {
    const patients = (await findAndCountAll({
      model: this.userModel,
      query,
      limit,
      offset,
      options: { selectFields: this.getSelectedFields(query.user_type) },
    })) as UserDocument[];
    return {
      patients,
      count: await countDocuments(this.userModel, { ...query }),
    };
  }

  async getPatient(userId: Types.ObjectId) {
    const user = await this.findOne({ _id: userId });
    const [subscriptions, appointments] = await Promise.all([
      this.getUserSubscriptions(userId),
      this.appointmentService.getPatientAppointments(userId, {}),
    ]);
    return { user, subscriptions, appointments };
  }

  async getUserSubscriptions(userId: Types.ObjectId) {
    return await find(
      this.subscriptionModel,
      { userId },
      { populate: 'planId' },
    );
  }

  async dashboardSpecialistAnalytics() {
    const [totalSpecialists, verifiedSpecialists, categoriesCount] =
      await Promise.all([
        countDocuments(this.userModel, {
          user_type: UserType.SPECIALIST,
        }),
        countDocuments(this.userModel, {
          user_type: UserType.SPECIALIST,
          verification_status: VerificationStatus.VERIFIED,
        }),
        this.userModel.aggregate([
          {
            $match: {
              user_type: UserType.SPECIALIST,
            },
          },
          {
            $group: {
              _id: '$professional_practice.category',
              count: { $sum: 1 },
            },
          },
        ]),
      ]);
    const unVerifiedSpecialists = totalSpecialists - verifiedSpecialists;
    const percentageVerified = (verifiedSpecialists / totalSpecialists) * 100;
    const percentageUnverified =
      (unVerifiedSpecialists / totalSpecialists) * 100;
    return {
      totalSpecialists,
      verifiedSpecialists,
      unVerifiedSpecialists,
      percentageVerified,
      percentageUnverified,
      categoriesCount,
    };
  }

  async aggregate(unitOfTime) {
    return this.userModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: moment().startOf(unitOfTime).toDate(),
            $lt: moment().endOf(unitOfTime).toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$created_at' },
          },
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async dashboardPatientAnalytics(queryIntervalDto: QueryIntervalDto) {
    switch (queryIntervalDto.interval) {
      case Interval.WEEK:
        const [patients, newPatients, weekData] = await Promise.all([
          countDocuments(this.userModel, {
            user_type: UserType.PATIENT,
          }),
          countDocuments(this.userModel, {
            user_type: UserType.PATIENT,
            created_at: {
              $gte: moment().startOf('week').toDate(),
              $lt: new Date(new Date().setHours(23, 59, 59)),
            },
          }),
          this.aggregate('week'),
        ]);
        return {
          duration: Interval.WEEK,
          totalPatients: patients,
          newPatients,
          graphData: weekData,
        };
      case Interval.MONTH:
        const [monthPatients, newMonthPatients, monthData] = await Promise.all([
          countDocuments(this.userModel, {
            user_type: UserType.PATIENT,
          }),
          countDocuments(this.userModel, {
            user_type: UserType.PATIENT,
            created_at: {
              $gte: moment().startOf('month').toDate(),
              $lt: new Date(new Date().setHours(23, 59, 59)),
            },
          }),
          this.aggregate('month'),
        ]);
        return {
          duration: Interval.MONTH,
          totalPatients: monthPatients,
          newPatients: newMonthPatients,
          graphData: monthData,
        };
      default:
        const [defaultTotalPatients, defaultNewPatients, defaultData] =
          await Promise.all([
            countDocuments(this.userModel, {
              user_type: UserType.PATIENT,
            }),
            countDocuments(this.userModel, {
              user_type: UserType.PATIENT,
              created_at: {
                $gte: moment().startOf('week').toDate(),
                $lt: new Date(new Date().setHours(23, 59, 59)),
              },
            }),
            this.aggregate('week'),
          ]);
        return {
          duration: Interval.WEEK,
          totalPatients: defaultTotalPatients,
          newPatients: defaultNewPatients,
          graphData: defaultData,
        };
    }
  }
}
