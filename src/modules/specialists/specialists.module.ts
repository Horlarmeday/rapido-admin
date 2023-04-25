import { Module } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { SpecialistsController } from './specialists.controller';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { AppointmentsModule } from '../appointments/appointments.module';
import { PatientsModule } from '../patients/patients.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../patients/entities/patient.entity';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from './entities/wallet-transactions.entity';

@Module({
  imports: [
    AppointmentsModule,
    PatientsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
    ]),
  ],
  controllers: [SpecialistsController],
  providers: [SpecialistsService, GeneralHelpers],
  exports: [SpecialistsService],
})
export class SpecialistsModule {}
