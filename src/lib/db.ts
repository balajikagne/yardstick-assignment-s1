import mongoose, { Connection } from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://balajiproject:Bkagne2025@cluster0.28ympja.mongodb.net/financeTracker?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Define a custom type for the global mongoose cache
type MongooseCache = {
  conn: Connection | null;
  promise: Promise<Connection> | null;
};

// Attach cache to the global object to persist across hot reloads (dev)
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

globalWithMongoose.mongoose = cached;

export async function connectToDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "financeTracker",
      bufferCommands: false,
    }).then(() => mongoose.connection as Connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
