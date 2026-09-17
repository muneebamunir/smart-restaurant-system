import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';

export type OrderType = 'online' | 'dining';
export type OrderStatus = 'pending' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'cash' | 'wallet';

export interface IOrderItem {
  item: Types.ObjectId;
  name: string;
  price: number;
  qty: number;
  note?: string;
}

export interface IOrderCustomer {
  name: string;
  phone?: string;
  address?: string;
}

interface IOrderBase extends Document {
  orderNumber: string;
  session: string;                // ← JWT (or the sid embedded inside it)
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  estimatedArrival?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

export interface IOnlineOrder extends IOrderBase {
  orderType: 'online';
  customer: IOrderCustomer & { phone: string; address: string };
  table?: never;
}

export interface IDiningOrder extends IOrderBase {
  orderType: 'dining';
  table: Types.ObjectId;
  customer: IOrderCustomer;
}

export type IOrder = IOnlineOrder | IDiningOrder;

const OrderItemSchema = new Schema<IOrderItem>(
  {
    item:  { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    name:  { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    qty:   { type: Number, required: true, min: 1 },
    note:  { type: String, trim: true, maxlength: 200 },
  },
  { _id: false }
);

const OrderCustomerSchema = new Schema<IOrderCustomer>(
  {
    name:    { type: String, required: true, trim: true, maxlength: 80 },
    phone:   { type: String, trim: true, maxlength: 30 },
    address: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },

    orderType: {
      type: String,
      enum: ['online', 'dining'],
      required: true,
      index: true,
    },

    /* The session identifier carried in the client's JWT cookie.
       Opaque string — could be a nanoid, a UUID, or the JWT itself.
       See "What to store" below for the trade-off. */
    session: {
      type: String,
      required: true,
      index: true,
      trim: true,
      maxlength: 512,
    },

    /* For dining orders */
    table: {
      type: Schema.Types.ObjectId,
      ref: 'Table',
      index: true,
    },

    /* Immutable snapshot of customer details at order time */
    customer: { type: OrderCustomerSchema, required: true },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => Array.isArray(v) && v.length > 0,
        message: 'An order must contain at least one item.',
      },
    },

    subtotal:    { type: Number, required: true, min: 0 },
    tax:         { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    discount:    { type: Number, default: 0, min: 0 },
    total:       { type: Number, required: true, min: 0 },

    couponCode:   { type: String, trim: true, uppercase: true },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash', 'wallet'],
      default: 'cash',
    },

    status: {
      type: String,
      enum: ['pending', 'preparing', 'on-the-way', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },

    estimatedArrival: { type: Date },
    deliveredAt:      { type: Date },
    cancelledAt:      { type: Date },
  },
  {
    timestamps: false,
    versionKey: false,
    discriminatorKey: 'orderType',
  }
);

OrderSchema.pre('validate', async function (this: IOrder) {
  if (this.orderType === 'dining') {
    if (!this.table) {
      throw new Error('Dining orders must reference a table.');
    }
    if (this.customer?.address) this.customer.address = undefined;
    if (this.deliveryFee && this.deliveryFee > 0) this.deliveryFee = 0;
  }

  if (this.orderType === 'online') {
    if (this.table) {
      throw new Error('Online orders cannot reference a table.');
    }
    if (!this.customer?.phone) {
      throw new Error('Online orders require a phone number.');
    }
    if (!this.customer?.address) {
      throw new Error('Online orders require a delivery address.');
    }
  }
});

/* Indexes */
OrderSchema.index({ status: 1, orderType: 1 });    // kitchen board
OrderSchema.index({ table: 1, status: 1 });        // table service
OrderSchema.index({ session: 1, status: 1 });      // "my orders" within a session

export const Order: Model<IOrder> =
  (models.Order as Model<IOrder>) || model<IOrder>('Order', OrderSchema);

export default Order;
