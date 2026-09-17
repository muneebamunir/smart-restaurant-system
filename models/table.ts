import { Schema, model, models, type Document, type Model } from 'mongoose';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'inactive';

export interface ITable extends Document {
  table_id: string;       // human-readable: "T01", "T02", "P-12"
  capacity: number;       // max seats
  location?: string;      // "Main Hall", "Patio", "VIP" — helps waiters
  status: TableStatus;
}

const TableSchema = new Schema<ITable>(
  {
    table_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9-]{1,10}$/, 'Table ID must be 1-10 chars: A-Z, 0-9, dash'],
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      validate: {
        validator: Number.isInteger,
        message: 'Capacity must be a whole number.',
      },
    },
    location: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'inactive'],
      default: 'available',
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Table: Model<ITable> =
  (models.Table as Model<ITable>) || model<ITable>('Table', TableSchema);

export default Table;