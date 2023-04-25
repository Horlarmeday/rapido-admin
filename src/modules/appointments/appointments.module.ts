import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { Appointment, AppointmentSchema } from './entities/appointment.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, GeneralHelpers],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
