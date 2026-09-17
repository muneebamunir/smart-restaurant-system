import { Schema, model, models, type Document, type Model, Types } from 'mongoose';

export interface IItemRating {
  item: Types.ObjectId;      // ref to Item
  rating: number;            // 1–5
  comment?: string;          // optional per-item comment
}

export interface IReview extends Document {
  reviewerName: string;
  order: Types.ObjectId;     // ref to Order — one review per order
  ratings: IItemRating[];
  comment?: string;          // overall comment about the order
  createdAt: Date;
  updatedAt: Date;
}

const ItemRatingSchema = new Schema<IItemRating>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 300 },
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    reviewerName: { type: String, required: true, trim: true, maxlength: 80 },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,     // one review per order — prevents duplicates
      index: true,
    },
    ratings: {
      type: [ItemRatingSchema],
      required: true,
      validate: {
        validator: (v: IItemRating[]) => v.length > 0,
        message: 'A review must include at least one item rating.',
      },
    },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// Common queries: "reviews for item X", "reviews by user Y"
ReviewSchema.index({ 'ratings.item': 1, createdAt: -1 });
ReviewSchema.index({ user: 1, createdAt: -1 });

export const Review: Model<IReview> =
  (models.Review as Model<IReview>) || model<IReview>('Review', ReviewSchema);

export default Review;