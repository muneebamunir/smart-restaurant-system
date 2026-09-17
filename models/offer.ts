import { Schema, model, models, type Document, type Model, type HydratedDocument } from 'mongoose';

export interface IOffer extends Document {
  coupon: string;
  discount: number;             // fraction: 0.20 = 20% off
  start_date: Date;
  expire_date: Date | null;     // null = never expires
  active: boolean;
}

const OfferSchema = new Schema<IOffer>(
  {
    coupon: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9_-]{3,20}$/, 'Coupon must be 3-20 chars, A-Z / 0-9 / _ / -'],
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    start_date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    expire_date: {
      type: Date,
      default: null,   // no expiry unless explicitly set
      
      validate: {
        validator: function (this: any, v: Date | null) {
          if (v == null) return true;
          return v > this.start_date;
        },
        message: 'expire_date must be after start_date',
      },
    },
    active: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Fast lookup for "is this coupon valid right now?"
OfferSchema.index({ coupon: 1, active: 1 });

// Instance method — null expire_date means "runs forever"
OfferSchema.methods.isValid = function (this: HydratedDocument<IOffer>): boolean {
  if (!this.active) return false;

  const now = new Date();
  if (now < this.start_date) return false;

  // No expiry → valid indefinitely
  if (this.expire_date == null) return true;

  return now <= this.expire_date;
};

export const Offer: Model<IOffer> =
  (models.Offer as Model<IOffer>) || model<IOffer>('Offer', OfferSchema);

export default Offer;