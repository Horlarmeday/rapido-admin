import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueryStatus } from '../patients/types/appointment-query.types';
import { countDocuments, find, findAndCountAll } from '../../common/crud/crud';
import { InjectModel } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentDocument,
} from './entities/appointment.entity';
import { isEmpty } from 'lodash';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';

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
}
