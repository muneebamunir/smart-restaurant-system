import { Schema, model, models, type Document, type Model } from 'mongoose';

export type UserType = 'admin' | 'chef' | 'waiter';

export interface IPassword {
  secret: string;          // bcrypt hash — never plain text
  reset_required: boolean; // true when admin has set a temp password
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: IPassword;
  type: UserType;
  logout: Date | null;     // sessions issued before this time are invalid
}

const PasswordSchema = new Schema<IPassword>(
  {
    secret: {
      type: String,
      required: true,
      minlength: 8,
      select: false,       // never returned by default
    },
    reset_required: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    password: {
      type: PasswordSchema,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['admin', 'chef', 'waiter'],
    },
    logout: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,   // ← explicitly disable auto timestamps
    versionKey: false,   // ← also drop the __v field if you don't use optimistic concurrency
  }
);

export const User: Model<IUser> =
  (models.User as Model<IUser>) || model<IUser>('User', UserSchema);

export default User;