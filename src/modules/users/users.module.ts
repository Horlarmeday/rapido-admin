import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/user.entity';
import { GeneralHelpers } from "../../common/helpers/general.helpers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, GeneralHelpers],
  exports: [MongooseModule, UsersService],
})
export class UsersModule {}
