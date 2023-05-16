import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueryStatus } from '../patients/types/appointment-query.types';
import {
  aggregateDataPerDay,
  aggregateDataPerMonth,
  aggregateDataPerWeek,
  aggregateDataPerYear,
  countDocuments,
  find,
  findAndCountAll,
} from '../../common/crud/crud';
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
      ...(status === 'All' ? {} : { status }),
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
              aggregateDataPerDay(this.appointmentModel, {
                created_at: {
                  $gte: moment(start_date).toDate(),
                  $lt: moment(end_date).toDate(),
                },
                ...this.filterQuery(fil),
              }),
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
            data: await aggregateDataPerDay(this.appointmentModel, {
              created_at: {
                $gte: moment(start_date).toDate(),
                $lt: moment(end_date).toDate(),
              },
              ...this.filterQuery(filter),
            }),
          },
        };
      }
      case Interval.WEEK: {
        if (!start_date) start_date = moment().subtract(3, 'month').toDate();
        if (!end_date) end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) =>
              aggregateDataPerWeek(this.appointmentModel, {
                created_at: {
                  $gte: moment(start_date).toDate(),
                  $lt: moment(end_date).toDate(),
                },
                ...this.filterQuery(fil),
              }),
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
            data: await aggregateDataPerWeek(this.appointmentModel, {
              created_at: {
                $gte: moment(start_date).toDate(),
                $lt: moment(end_date).toDate(),
              },
              ...this.filterQuery(filter),
            }),
          },
        };
      }
      case Interval.MONTH: {
        if (!start_date) start_date = moment().subtract(8, 'month').toDate();
        if (!end_date) end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) =>
              aggregateDataPerMonth(this.appointmentModel, {
                created_at: {
                  $gte: moment(start_date).toDate(),
                  $lt: moment(end_date).toDate(),
                },
                ...this.filterQuery(fil),
              }),
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
            data: await aggregateDataPerMonth(this.appointmentModel, {
              created_at: {
                $gte: moment(start_date).toDate(),
                $lt: moment(end_date).toDate(),
              },
              ...this.filterQuery(filter),
            }),
          },
        };
      }
      case Interval.YEAR: {
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) =>
              aggregateDataPerYear(this.appointmentModel, {
                ...this.filterQuery(fil),
              }),
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
            data: await aggregateDataPerYear(this.appointmentModel, {
              ...this.filterQuery(filter),
            }),
          },
        };
      }
      default: {
        start_date = moment().subtract(2, 'month').toDate();
        end_date = moment().toDate();
        if (isArray(filter)) {
          const data = await Promise.all(
            filter.map((fil) =>
              aggregateDataPerDay(this.appointmentModel, {
                created_at: {
                  $gte: moment(start_date).toDate(),
                  $lt: moment(end_date).toDate(),
                },
                ...this.filterQuery(fil),
              }),
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
            data: await aggregateDataPerDay(this.appointmentModel, {
              created_at: {
                $gte: moment(start_date).toDate(),
                $lt: moment(end_date).toDate(),
              },
              ...this.filterQuery(filter),
            }),
          },
        };
      }
    }
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
