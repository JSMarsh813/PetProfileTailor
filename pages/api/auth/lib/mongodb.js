// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
//https://hevodata.com/learn/next-js-mongodb-connection/

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Add Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  try {
    clientPromise = await client.connect();
  } catch (e) {
    console.log(e);
  }
}

export default clientPromise;
