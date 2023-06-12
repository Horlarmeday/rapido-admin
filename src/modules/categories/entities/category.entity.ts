import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Category {
  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Array })
  specializations: string[];
}
export const CategorySchema = SchemaFactory.createForClass(Category);
