import { Module } from '@nestjs/common';
import { LifeguardsService } from './lifeguards.service';
import { LifeguardsController } from './lifeguards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lifeguard, LifeguardSchema } from './entities/lifeguard.entity';
import { GeneralHelpers } from '../../common/helpers/general.helpers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lifeguard.name, schema: LifeguardSchema },
    ]),
  ],
  controllers: [LifeguardsController],
  providers: [LifeguardsService, GeneralHelpers],
})
export class LifeguardsModule {}
