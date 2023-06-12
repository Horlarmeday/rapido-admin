import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/messages/messages';
import { Types } from 'mongoose';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.categoriesService.createCategory(
      createCategoryDto,
    );
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Get()
  async getCategories() {
    const result = await this.categoriesService.getCategories();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get(':id')
  async getCategory(@Param('id') id: Types.ObjectId) {
    const result = await this.categoriesService.getCategory(id);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: Types.ObjectId,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const result = await this.categoriesService.updateCategory(
      id,
      updateCategoryDto,
    );
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: Types.ObjectId) {
    const result = await this.categoriesService.deleteCategory(id);
    return sendSuccessResponse(Messages.DELETED, result);
  }
}
