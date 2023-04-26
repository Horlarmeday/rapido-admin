import { Injectable } from '@nestjs/common';
import { create, find, findOne, updateOne } from 'src/common/crud/crud';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './entities/plan.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class PlansService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}
  async createPlan(createPlanDto: CreatePlanDto) {
    return await create(this.planModel, { ...createPlanDto });
  }

  async findPlans() {
    return await find(this.planModel, {});
  }

  async updatePlan(planId: string, updatePlanDto: UpdatePlanDto) {
    return await updateOne(
      this.planModel,
      { _id: planId },
      { ...updatePlanDto },
    );
  }

  async findOnePlan(planId: Types.ObjectId): Promise<PlanDocument> {
    return await findOne(this.planModel, { _id: planId });
  }
}
