import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Category: Model<ICategory> =
  (models.Category as Model<ICategory>) ||
  model<ICategory>('Category', CategorySchema);

export default Category;