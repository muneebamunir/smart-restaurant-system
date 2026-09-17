import mongoose, { type Mongoose } from 'mongoose';

export interface ConnectOptions {
  uri?: string;
  onError?: (e: unknown) => void;
  onSuccess?: (conn: Mongoose) => void;
  mongooseOptions?: mongoose.ConnectOptions;
}

interface CachedConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: CachedConnection | undefined;
}

const cached: CachedConnection =
  global.__mongooseCache ?? { conn: null, promise: null };
global.__mongooseCache = cached;

export async function connectDB({
  uri = process.env.MONGO_URL,
  onError,
  onSuccess,
  mongooseOptions,
}: ConnectOptions = {}): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!uri) {
    const err = new Error(
      'MONGO_URL is not set. Add it to .env.local at the project root.'
    );
    onError?.(err);
    throw err;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
        ...mongooseOptions,
      })
      .catch((e: unknown) => {
        cached.promise = null;
        cached.conn = null;
        onError?.(e);
        throw e;
      });
  }

  try {
    cached.conn = await cached.promise;
    onSuccess?.(cached.conn);
    return cached.conn;
  } catch (e) {
    throw e;
  }
}

export async function disconnectDB(): Promise<void> {
  if (cached.conn) await cached.conn.disconnect();
  cached.conn = null;
  cached.promise = null;
}

export async function withDB<T>(
  fn: () => Promise<T>,
  options?: ConnectOptions
): Promise<T> {
  await connectDB(options);
  return fn();
}