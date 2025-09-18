// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUserByProfileName } from "@utils/getUserByProfileName";
import User from "@/models/User";

export default async function handler(req, res) {
  const { name: profilename } = req.query;

  if (req.method !== "GET") return res.status(405).end();

  try {
    const user = await getUserByProfileName(profilename);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Apply select/populate only in this API route
    const detailedUser = await User.findById(user.id).select(
      "name followers profileimage profilename bioblurb location",
    );

    res.status(200).json(detailedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
