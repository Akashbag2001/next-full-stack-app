import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongo URI in the env variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDataBase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const options = {}
    mongoose.connect(MONGODB_URI, options).then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn;
}
