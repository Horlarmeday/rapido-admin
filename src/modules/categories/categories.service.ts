import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { Model, Types } from 'mongoose';
import {
  create, deleteOne,
  find,
  findOne,
  updateOneAndReturn
} from "../../common/crud/crud";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    return await create(this.categoryModel, { ...createCategoryDto });
  }

  async getCategories() {
    return await find(this.categoryModel, {});
  }

  async getCategory(categoryId: Types.ObjectId) {
    return await findOne(this.categoryModel, { _id: categoryId });
  }

  async updateCategory(
    categoryId: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return updateOneAndReturn(
      this.categoryModel,
      { _id: categoryId },
      { ...updateCategoryDto },
    );
  }

  async deleteCategory(categoryId: Types.ObjectId) {
    return await deleteOne(this.categoryModel, { _id: categoryId });
  }
}
