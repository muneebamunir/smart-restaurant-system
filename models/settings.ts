import { Schema, model, models, type Document, type Model, type HydratedDocument } from 'mongoose';

export type CurrencyCode = 'PKR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'INR';

export type CurrencyType = {
  code: CurrencyCode;
  symbol: string;    // "Rs", "$", "€" — for quick display
};

export interface IBusinessHours {
  open: string;    // "10:00" — 24h format
  close: string;   // "23:00"
  closed: boolean; // true = closed that day
}

export interface ISettings extends Document {
  /* ── Identity ─────────────────────────────────────── */
  supportPhone?: string;
  supportEmail?: string;
  address?: string;

  /* ── Localisation ─────────────────────────────────── */
  currency: CurrencyType;     // ← merged code + symbol
  locale: string;             // "en-PK", "en-US" — for Intl formatting
  timezone: string;           // "Asia/Karachi"

  /* ── Pagination ───────────────────────────────────── */
  paginationSize: number;

  /* ── Sessions & Auth ──────────────────────────────── */
  sessionDays: number;
  guestSessionHours: number;
  passwordMinLength: number;
  maxLoginAttempts: number;
  lockoutMinutes: number;

  /* ── Ordering ─────────────────────────────────────── */
  taxPercent: number;
  deliveryFee: number;

  /* ── Business hours ───────────────────────────────── */
  hours: {
    monday:    IBusinessHours;
    tuesday:   IBusinessHours;
    wednesday: IBusinessHours;
    thursday:  IBusinessHours;
    friday:    IBusinessHours;
    saturday:  IBusinessHours;
    sunday:    IBusinessHours;
  };
}

/* ── Sub-schemas ──────────────────────────────────────── */

const CurrencySchema = new Schema<CurrencyType>(
  {
    code: {
      type: String,
      enum: ['PKR', 'USD', 'EUR', 'GBP', 'AED', 'SAR', 'INR'],
      default: 'PKR',
      required: true,
      uppercase: true,
    },
    symbol: {
      type: String,
      default: 'Rs',
      required: true,
      trim: true,
      maxlength: 5,
    },
  },
  { _id: false }
);

const BusinessHoursSchema = new Schema<IBusinessHours>(
  {
    open:  { type: String, match: [/^\d{2}:\d{2}$/, 'Use HH:MM format'], default: '10:00' },
    close: { type: String, match: [/^\d{2}:\d{2}$/, 'Use HH:MM format'], default: '23:00' },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const defaultDay = () => ({ open: '10:00', close: '23:00', closed: false });

/* ── Main schema ──────────────────────────────────────── */

const SettingsSchema = new Schema<ISettings>(
  {
    /* Identity */
    supportPhone: { type: String, trim: true, maxlength: 30 },
    supportEmail: { type: String, trim: true, lowercase: true },
    address:      { type: String, trim: true, maxlength: 200 },

    /* Localisation */
    currency: {
      type: CurrencySchema,
      required: true,
      default: () => ({ code: 'PKR', symbol: 'Rs' }),
    },
    locale:   { type: String, default: 'en-PK', trim: true, maxlength: 10 },
    timezone: { type: String, default: 'Asia/Karachi', trim: true, maxlength: 60 },

    /* Pagination */
    paginationSize: { type: Number, default: 20, min: 5, max: 200 },

    /* Sessions & Auth */
    sessionDays:      { type: Number, default: 7,  min: 1, max: 90 },
    guestSessionHours:{ type: Number, default: 4,  min: 1, max: 48 },
    passwordMinLength:{ type: Number, default: 8,  min: 6, max: 32 },
    maxLoginAttempts: { type: Number, default: 5,  min: 3, max: 20 },
    lockoutMinutes:   { type: Number, default: 15, min: 1, max: 240 },

    /* Ordering */
    taxPercent:   { type: Number,  default: 8,    min: 0, max: 100 },
    deliveryFee:  { type: Number,  default: 2.99, min: 0 },

    /* Business hours */
    hours: {
      monday:    { type: BusinessHoursSchema, default: defaultDay },
      tuesday:   { type: BusinessHoursSchema, default: defaultDay },
      wednesday: { type: BusinessHoursSchema, default: defaultDay },
      thursday:  { type: BusinessHoursSchema, default: defaultDay },
      friday:    { type: BusinessHoursSchema, default: defaultDay },
      saturday:  { type: BusinessHoursSchema, default: defaultDay },
      sunday:    { type: BusinessHoursSchema, default: defaultDay },
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

/* ── Singleton access ─────────────────────────────────── */

export interface ISettingsModel extends Model<ISettings> {
  get(): Promise<HydratedDocument<ISettings>>;
  update(patch: Partial<ISettings>): Promise<HydratedDocument<ISettings>>;
}

SettingsSchema.statics.get = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

SettingsSchema.statics.update = async function (patch: Partial<ISettings>) {
  return this.findOneAndUpdate(
    {},
    { $set: patch },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
};

export const Settings: ISettingsModel =
  (models.Settings as ISettingsModel) ||
  model<ISettings, ISettingsModel>('Settings', SettingsSchema);

export default Settings;