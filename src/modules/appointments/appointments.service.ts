import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueryStatus } from '../patients/types/appointment-query.types';
import { countDocuments, find, findAndCountAll } from '../../common/crud/crud';
import { InjectModel } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentDocument,
  AppointmentStatus,
} from './entities/appointment.entity';
import { isEmpty } from 'lodash';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';
import * as moment from 'moment/moment';
import { Interval } from '../patients/dto/query-interval.dto';
import { isArray } from 'class-validator';
import {
  AppointmentAnalyticsFilter,
  AppointmentsAnalyticsDto,
} from './dto/appointments-analytics.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    private readonly generalHelpers: GeneralHelpers,
  ) {}
  async getPatientAppointments(
    userId: Types.ObjectId,
    queryStatus: QueryStatus,
  ) {
    const { status } = queryStatus || {};
    return await find(this.appointmentModel, {
      patient: userId,
      ...(!isEmpty(status) && { status }),
    });
  }

  async getSpecialistAppointments(
    userId: Types.ObjectId,
    queryStatus: QueryStatus,
  ) {
    const { status } = queryStatus || {};
    return await find(this.appointmentModel, {
      specialist: userId,
      ...(status && { status }),
    });
  }

  async getAppointments(appointmentsQueryDto: AppointmentsQueryDto) {
    const { currentPage, pageLimit, date, status, medium, meeting_class } =
      appointmentsQueryDto;
    const { limit, offset } = this.generalHelpers.calcLimitAndOffset(
      +currentPage,
      pageLimit,
    );
    const query = {
      status,
      ...(date && {
        created_at: {
          $gte: new Date(new Date(date).setHours(0, 0, 0)),
          $lte: new Date(new Date(date).setHours(23, 59, 59)),
        },
      }),
      ...(medium && { meeting_type: medium }),
      ...(meeting_class && { meeting_class }),
    };
    const appointments = (await findAndCountAll({
      model: this.appointmentModel,
      query,
      limit,
      offset,
    })) as AppointmentDocument[];

    return this.generalHelpers.paginate(
      appointments,
      +currentPage,
      limit,
      await countDocuments(this.appointmentModel, { ...query }),
    );
  }

  async analyticsData() {
    const [
      totalAppointments,
      cancelledAppointments,
      completedAppointments,
      totalAppointmentsYesterday,
      cancelledAppointmentsYesterday,
      completedAppointmentsYesterday,
    ] = await Promise.all([
      countDocuments(this.appointmentModel, {}),
      countDocuments(this.appointmentModel, {
        status: AppointmentStatus.CANCELLED,
      }),
      countDocuments(this.appointmentModel, {
        status: AppointmentStatus.COMPLETED,
      }),
      countDocuments(this.appointmentModel, {
        created_at: {
          $gte: moment().subtract(1, 'day').startOf('day').toDate(),
          $lte: moment().subtract(1, 'day').endOf('day').toDate(),
        },
      }),
      countDocuments(this.appointmentModel, {
        status: AppointmentStatus.CANCELLED,
        created_at: {
          $gte: moment().subtract(1, 'day').startOf('day').toDate(),
          $lte: moment().subtract(1, 'day').endOf('day').toDate(),
        },
      }),
      countDocuments(this.appointmentModel, {
        status: AppointmentStatus.COMPLETED,
        created_at: {
          $gte: moment().subtract(1, 'day').startOf('day').toDate(),
          $lte: moment().subtract(1, 'day').endOf('day').toDate(),
        },
      }),
    ]);
    return {
      totalAppointments,
      cancelledAppointments,
      completedAppointments,
      totalAppointmentsYesterday,
      cancelledAppointmentsYesterday,
      completedAppointmentsYesterday,
    };
  }

  async analyticsGraphData(appointmentsAnalyticsDto: AppointmentsAnalyticsDto) {
    let { start_date, end_date } = appointmentsAnalyticsDto;
    const { interval, filter } = appointmentsAnalyticsDto;

    switch (interval) {
      case Interval.DAY: {
        if (!start_date)
          start_date = moment().subtract(2, 'month').startOf('month').toDate();
        if (!end_date) end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) =>
              this.analyticsDataPerDay(start_date, end_date, fil),
            ),
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
            data: await this.analyticsDataPerDay(start_date, end_date, filter),
          },
        };
      }
      case Interval.WEEK: {
        if (!start_date) start_date = moment().subtract(3, 'month').toDate();
        if (!end_date) end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) =>
              this.analyticsDataPerWeek(start_date, end_date, fil),
            ),
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
            data: await this.analyticsDataPerWeek(start_date, end_date, filter),
          },
        };
      }
      case Interval.MONTH: {
        if (!start_date) start_date = moment().subtract(8, 'month').toDate();
        if (!end_date) end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) =>
              this.analyticsDataPerMonth(start_date, end_date, fil),
            ),
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
            data: await this.analyticsDataPerMonth(
              start_date,
              end_date,
              filter,
            ),
          },
        };
      }
      case Interval.YEAR: {
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) => this.analyticsDataPerYear(fil)),
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
          data: { filter, data: await this.analyticsDataPerYear(filter) },
        };
      }
      default: {
        start_date = moment().subtract(2, 'month').toDate();
        end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) =>
              this.analyticsDataPerDay(start_date, end_date, fil),
            ),
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
            data: await this.analyticsDataPerDay(start_date, end_date, filter),
          },
        };
      }
    }
  }

  private async analyticsDataPerDay(
    startDate: Date,
    endDate: Date,
    filter: AppointmentAnalyticsFilter,
  ) {
    return this.appointmentModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: moment(startDate).toDate(),
            $lt: moment(endDate).toDate(),
          },
          ...this.filterQuery(filter),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$created_at',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  private async analyticsDataPerYear(filter: AppointmentAnalyticsFilter) {
    return this.appointmentModel.aggregate([
      // Filter documents
      {
        $match: {
          $match: {
            ...this.filterQuery(filter),
          },
        },
      },
      // Group documents by year and calculate the count
      {
        $group: {
          _id: { $year: '$created_at' },
          count: { $sum: 1 },
        },
      },
      // Project the results to the desired format
      {
        $project: {
          _id: 0,
          year: '$_id',
          count: 1,
        },
      },
      // Sort documents by year in ascending order
      {
        $sort: { year: 1 },
      },
    ]);
  }

  private async analyticsDataPerMonth(
    startDate: Date,
    endDate: Date,
    filter: AppointmentAnalyticsFilter,
  ) {
    return this.appointmentModel.aggregate([
      // Filter documents from the last 6 months
      {
        $match: {
          $match: {
            created_at: {
              $gte: moment(startDate).toDate(),
              $lt: moment(endDate).toDate(),
            },
            ...this.filterQuery(filter),
          },
        },
      },
      // Group documents by month and calculate the count
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' },
          },
          count: { $sum: 1 },
        },
      },
      // Project the results to the desired format
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: new Date(Number('$_id.year'), Number('$_id.month'), 1),
            },
          },
          count: 1,
        },
      },
      // Sort documents by month in ascending order
      {
        $sort: { month: 1 },
      },
    ]);
  }

  private async analyticsDataPerWeek(
    startDate: Date,
    endDate: Date,
    filter: AppointmentAnalyticsFilter,
  ) {
    return this.appointmentModel.aggregate([
      // Filter documents from the last 3 months
      {
        $match: {
          created_at: {
            $gte: moment(startDate).toDate(),
            $lt: moment(endDate).toDate(),
          },
          ...this.filterQuery(filter),
        },
      },
      // Group documents by week and calculate the count
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            week: { $week: '$created_at' },
          },
          count: { $sum: 1 },
        },
      },
      // Project the results to the desired format
      {
        $project: {
          _id: 0,
          week: { $concat: ['Week ', { $toString: '$_id.week' }] },
          year: '$_id.year',
          count: 1,
        },
      },
      // Sort documents by year and week in ascending order
      {
        $sort: { year: 1, week: 1 },
      },
    ]);
  }

  private filterQuery(filter: AppointmentAnalyticsFilter) {
    switch (filter) {
      case AppointmentAnalyticsFilter.ALL:
        return {};
      case AppointmentAnalyticsFilter.CANCELLED_APPOINTMENTS:
        return { status: AppointmentStatus.CANCELLED };
      case AppointmentAnalyticsFilter.COMPLETED_APPOINTMENTS:
        return { status: AppointmentStatus.COMPLETED };
      default:
        return {};
    }
  }
}
