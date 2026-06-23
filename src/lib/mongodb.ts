/* ──────────────────────────────────────────────────────
 *  MM Sri Lanka – MongoDB Connection (Mongoose singleton)
 * ────────────────────────────────────────────────────── */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global cache so we reuse the same Mongoose connection across
 * hot-reloads in development (Next.js re-evaluates modules on
 * every request in dev mode).
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* eslint-disable no-var */
declare global {
  var mongooseCache: MongooseCache | undefined;
}
/* eslint-enable no-var */

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB. Returns the cached connection when available,
 * otherwise creates a new one and caches it.
 */
export async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if none exists
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null; // allow retry on next call
        console.error("❌ MongoDB connection error:", error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
