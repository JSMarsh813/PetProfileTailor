import mongoose from "mongoose";

const source = process.env.MONGODB_URI;

const connection = {};

async function connect() {
  if (connection.isConnected) {
    console.log("already connected");
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("use previous connection");
      return;
    }
    // await mongoose.disconnect();
  }
  console.log(source);

  try {
    const db = await mongoose
      .connect(source, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch(console.error);
    //MongoParseError: option usecreateindex is not supported
    //https://github.com/Automattic/mongoose/issues/9894

    console.log("new connection");
    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnected");
    }
  }
}
function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
