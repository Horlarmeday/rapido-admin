import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Promotion,
  PromotionDocument,
  RewardType,
} from './entities/promotion.entity';
import { Model, Types } from 'mongoose';
import {
  countDocuments,
  create,
  deleteOne,
  findAndCountAll,
  findById,
  updateOneAndReturn,
} from '../../common/crud/crud';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { QueryDto } from '../../common/helpers/url-query.dto';
import { Messages } from '../../core/messages/messages';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name)
    private promotionModel: Model<PromotionDocument>,
    private generalHelpers: GeneralHelpers,
  ) {}
  async createPromotion(createPromotionDto: CreatePromotionDto) {
    return await create(this.promotionModel, { ...createPromotionDto });
  }

  async getPromotions(query: QueryDto) {
    const { currentPage, pageLimit, search, filterBy } = query;
    const { limit, offset } = this.generalHelpers.calcLimitAndOffset(
      +currentPage,
      pageLimit,
    );

    let result: { promotions: PromotionDocument[]; count: number };

    if (search) {
      result = await this.searchPromotions(filterBy, limit, offset, search);
    } else {
      result = await this.queryPromotions(filterBy, limit, offset);
    }

    return this.generalHelpers.paginate(
      result.promotions,
      +currentPage,
      limit,
      result.count,
    );
  }

  async queryPromotions(
    filterBy: string | undefined,
    limit: number,
    offset: number,
  ): Promise<{ promotions: PromotionDocument[]; count: number }> {
    const query = {
      ...(filterBy && filterBy === 'All' ? {} : { status: filterBy }),
    };
    const promotions = (await findAndCountAll({
      model: this.promotionModel,
      query,
      limit,
      offset,
    })) as PromotionDocument[];
    return {
      promotions,
      count: await countDocuments(this.promotionModel, { ...query }),
    };
  }

  async searchPromotions(
    filterBy: string | undefined,
    limit: number,
    offset: number,
    search: string,
  ): Promise<{ promotions: PromotionDocument[]; count: number }> {
    const query = {
      ...(filterBy && filterBy === 'All' ? {} : { status: filterBy }),
      $text: { $search: search },
    };
    const promotions = (await findAndCountAll({
      model: this.promotionModel,
      query,
      limit,
      offset,
      displayScore: true,
    })) as PromotionDocument[];
    return {
      promotions,
      count: await countDocuments(this.promotionModel, { ...query }),
    };
  }

  async getOnePromotion(promotionId: Types.ObjectId) {
    const promotion = await findById(this.promotionModel, promotionId);
    if (!promotion) throw new NotFoundException(Messages.NOT_FOUND);
    return promotion;
  }

  async updatePromotion(query: any, fieldsToUpdate: any) {
    return await updateOneAndReturn(
      this.promotionModel,
      { ...query },
      { ...fieldsToUpdate },
    );
  }

  async deletePromotion(promotionId: Types.ObjectId) {
    return await deleteOne(this.promotionModel, { _id: promotionId });
  }

  getDiscount(amount: number, type: RewardType) {
    switch (type) {
      case RewardType.FIXED:
    }
  }
}
