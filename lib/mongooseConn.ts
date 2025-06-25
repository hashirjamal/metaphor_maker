// lib/mongoose.ts
import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGO_DB_CONN!;

console.log(process.env.MONGO_DB_CONN)
if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_DB_CONN environment variable in .env.local');
}

let cached = global.mongoose as { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise && MONGODB_URI) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
