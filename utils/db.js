import mongoose from "mongoose";

mongoose.set("strictQuery", true);
// queries don't accept fields not in schema
// // in mongoose 7 it will default to false, this will also turn off the strictQuery wraning

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) throw new Error("MONGODB_URI not defined");

let cached = global.mongoose;
// Caches the connection globally across serverless invocations (global.mongoose) — avoids multiple reconnects on hot reload or repeated requests.

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    console.log("Using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("New MongoDB connection established");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err; // don't silently continue
  }

  return cached.conn;
}

async function disconnect() {
  if (cached.conn && process.env.NODE_ENV === "production") {
    await mongoose.disconnect();
    cached.conn = null;
  }
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  if (doc.createdAt) doc.createdAt = doc.createdAt.toString();
  if (doc.updatedAt) doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

export default { connect, disconnect, convertDocToObj };
