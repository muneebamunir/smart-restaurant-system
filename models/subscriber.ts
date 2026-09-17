import { Schema, model, models, type Document, type Model } from 'mongoose';

export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced';

export interface ISubscriber extends Document {
  email: string;
  status: SubscriberStatus;
  source?: string;            // where they subscribed from: "footer", "checkout", "qr-menu"
  unsubscribeToken: string;   // opaque token embedded in unsubscribe links
  subscribedAt: Date;
  unsubscribedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed', 'bounced'],
      default: 'active',
      index: true,
    },
    source: {
      type: String,
      trim: true,
      maxlength: 40,
    },
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subscribedAt: {
      type: Date,
      default: () => new Date(),
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Fast lookup of everyone you can actually send to
SubscriberSchema.index({ status: 1, subscribedAt: -1 });

export const Subscriber: Model<ISubscriber> =
  (models.Subscriber as Model<ISubscriber>) ||
  model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;