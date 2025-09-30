import User from "@models/User";
import db from "./db";

export async function getUserByProfileName(profilename) {
  await db.connect();
  const user = await User.findOne({ profileName: profilename.toLowerCase() });
  return user; // returns null if not found
}
