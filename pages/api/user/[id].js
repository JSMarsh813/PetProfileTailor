import db from "@utils/db";
import User from "@models/User";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const { ok, session } = await getSessionForApis({
    req,
    res,
  });
  if (!ok) {
    return;
  }

  const signedInUser = session.user.id;

  await db.connect();

  switch (method) {
    case "GET" /* Get a user by its ID */:
      try {
        const user = await User.findById(signedInUser);
        if (!user) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const user = await User.findByIdAndUpdate(signedInUser, req.body, {
          new: true,
          runValidators: true,
        });

        if (!user) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    // case 'DELETE' /* Delete a model by its ID */:
    //   try {
    //     const deletedPet = await Pet.deleteOne({ _id: id })
    //     if (!deletedPet) {
    //       return res.status(400).json({ success: false })
    //     }
    //     res.status(200).json({ success: true, data: {} })
    //   } catch (error) {
    //     res.status(400).json({ success: false })
    //   }
    //   break

    default:
      res.status(400).json({ success: false });
      break;
  }
}
