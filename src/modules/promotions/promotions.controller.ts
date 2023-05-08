import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Types } from 'mongoose';
import { DeletePromotionDto } from './dto/delete-promotion.dto';
import { ChangePromotionStatusDto } from './dto/change-promotion-status.dto';
import { PromotionStatus } from './entities/promotion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Messages } from '../../core/messages/messages';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { QueryDto } from '../../common/helpers/url-query.dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}
  @Post()
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    const result = await this.promotionsService.createPromotion(
      createPromotionDto,
    );
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Get()
  async findAll(@Query() queryDto: QueryDto) {
    const result = await this.promotionsService.getPromotions(queryDto);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    const result = await this.promotionsService.getOnePromotion(id);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Patch()
  async update(@Body() updatePromotionDto: UpdatePromotionDto) {
    const result = await this.promotionsService.updatePromotion(
      { _id: updatePromotionDto.promotionId },
      updatePromotionDto,
    );
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Patch('activate')
  async activatePromotion(
    @Body() changePromotionStatusDto: ChangePromotionStatusDto,
  ) {
    const result = await this.promotionsService.updatePromotion(
      { _id: changePromotionStatusDto.promotionId },
      { status: PromotionStatus.ACTIVE },
    );
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Patch('deactivate')
  async deactivatePromotion(
    @Body() changePromotionStatusDto: ChangePromotionStatusDto,
  ) {
    const result = await this.promotionsService.updatePromotion(
      { _id: changePromotionStatusDto.promotionId },
      { status: PromotionStatus.DEACTIVATED },
    );
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Delete()
  async remove(@Body() deletePromotionDto: DeletePromotionDto) {
    const result = await this.promotionsService.deletePromotion(
      deletePromotionDto.promotionId,
    );
    return sendSuccessResponse(Messages.UPDATED, result);
  }
}
