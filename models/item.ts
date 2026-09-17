import { Schema, model, models, type Document, type Model, Types } from 'mongoose';

export interface IVariant {
  name: string;         // "Small", "Medium", "Large", "Single", "Double"…
  price: number;        // this variant's own base price
  inStock: boolean;     // can be sold out independently
  isDefault: boolean;   // which one is pre-selected in the UI
}

export interface IItem extends Document {
  name: string;
  category: Types.ObjectId;     // ref to Category
  image_url: string;
  description?: string;
  variants: IVariant[];
  discountPercent: number;      // 0–100, applies to ALL variants
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeColor?: string;
  inStock: boolean;
}

const VariantSchema = new Schema<IVariant>(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    price: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    image_url: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
    variants: {
      type: [VariantSchema],
      required: true,
      validate: {
        validator: (v: IVariant[]) => Array.isArray(v) && v.length > 0,
        message: 'An item must have at least one variant.',
      },
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    badge: { type: String, trim: true },
    badgeColor: { type: String, trim: true },
    inStock: { type: Boolean, default: true },
  },
  {
    timestamps: false,   // removed as requested
    versionKey: false,
  }
);

// ── Enforce exactly one default variant ───────────────────────
ItemSchema.pre('validate', async function (this: IItem) {
  if (!this.variants?.length) return;

  const defaults = this.variants.filter((v) => v.isDefault);

  if (defaults.length > 1) {
    throw new Error('Only one variant can be marked as default.');
  }

  if (defaults.length === 0) {
    this.variants[0].isDefault = true;
  }
});

// ── Indexes ───────────────────────────────────────────────────
// Sort menu listings by cheapest variant
ItemSchema.index({ category: 1, 'variants.price': 1 });

// Text search across name and description
ItemSchema.index({ name: 'text', description: 'text' });

// ── Virtuals ──────────────────────────────────────────────────

// Effective price per variant after discount
ItemSchema.virtual('variantsWithDiscount').get(function (this: IItem) {
  const factor = 1 - this.discountPercent / 100;
  return this.variants.map((v) => ({
    ...v,
    effectivePrice: Number((v.price * factor).toFixed(2)),
  }));
});

// Cheapest effective price — useful for "from $X.XX" on cards
ItemSchema.virtual('displayPrice').get(function (this: IItem) {
  if (!this.variants?.length) return 0;
  const factor = 1 - this.discountPercent / 100;
  const min = Math.min(...this.variants.map((v) => v.price));
  return Number((min * factor).toFixed(2));
});

ItemSchema.set('toJSON', { virtuals: true });
ItemSchema.set('toObject', { virtuals: true });

export const Item: Model<IItem> =
  (models.Item as Model<IItem>) || model<IItem>('Item', ItemSchema);

export default Item;