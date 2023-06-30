import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lifeguard, LifeguardDocument } from './entities/lifeguard.entity';
import { Model, Types } from "mongoose";
import { countDocuments, findAndCountAll, findOne } from "../../common/crud/crud";
import { LifeguardFilterDto } from './dto/lifeguard-filter.dto';
import { GeneralHelpers } from '../../common/helpers/general.helpers';

@Injectable()
export class LifeguardsService {
  constructor(
    @InjectModel(Lifeguard.name)
    private lifeguardModel: Model<LifeguardDocument>,
    private readonly generalHelpers: GeneralHelpers,
  ) {}

  async getLifeguards(lifeguardFilterDto: LifeguardFilterDto) {
    const { currentPage, pageLimit, search, status } = lifeguardFilterDto;
    const { limit, offset } = this.generalHelpers.calcLimitAndOffset(
      +currentPage,
      pageLimit,
    );
    const query = {
      ...(status && status === 'All' ? {} : { status }),
      ...(search && { $text: { $search: search } }),
    };
    let result: { lifeguards: LifeguardDocument[]; count: number };

    if (search) {
      result = await this.searchLifeguards(limit, offset, search, query);
    } else {
      result = await this.queryLifeguards(limit, offset, query);
    }

    return this.generalHelpers.paginate(
      result.lifeguards,
      +currentPage,
      limit,
      result.count,
    );
  }

  async searchLifeguards(
    limit: number,
    offset: number,
    search: string,
    query,
  ): Promise<{ lifeguards: LifeguardDocument[]; count: number }> {
    const lifeguards = (await findAndCountAll({
      model: this.lifeguardModel,
      query,
      limit,
      offset,
      options: { selectFields: this.getSelectedFields() },
      displayScore: true,
     })) as LifeguardDocument[];
    return {
      lifeguards,
      count: await countDocuments(this.lifeguardModel, { ...query }),
    };
  }

  async queryLifeguards(
    limit: number,
    offset: number,
    query,
  ): Promise<{ lifeguards: LifeguardDocument[]; count: number }> {
    const lifeguards = (await findAndCountAll({
      model: this.lifeguardModel,
      query,
      limit,
      offset,
      options: { selectFields: this.getSelectedFields() },
    })) as LifeguardDocument[];
    return {
      lifeguards,
      count: await countDocuments(this.lifeguardModel, { ...query }),
    };
  }

  async getOneLifeguard(lifeguardId: Types.ObjectId) {
    return await findOne(
      this.lifeguardModel,
      { _id: lifeguardId },
      { selectFields: ['-password', 'card_details'] },
    );
  }

  getSelectedFields() {
    return ['-password', '-card_details'];
  }
}
