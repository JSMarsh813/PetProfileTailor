import Names from "@models/Names";
import db from "@utils/db";
import { checkOwnership } from "@/utils/api/checkOwnership";

const handler = async (req, res) => {
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "PUT") {
    return putHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};
const getHandler = async (req, res) => {
  await db.connect();
  console.log("req.query", req.query);
  const individualname = await Names.findOne({ id: req.query._id });

  return res.status(200).json(individualname);
};

//

// I also had the same problem. It was simply solved by using findOne method instead of findById method of mongoose.
// https://stackoverflow.com/questions/52147649/mongoose-findbyid-return-null
const putHandler = async (req, res) => {
  await db.connect();

  const { name, description, tags } = req.body; // tags = array of ObjectIds or strings

  // convert incoming tags to ObjectIds
  const tagsAsObjectIds = (tags || []).map((t) =>
    t instanceof mongoose.Types.ObjectId ? t : mongoose.Types.ObjectId(t),
  );

  const individualname = await Names.findById(req.query.id);

  if (!individualname)
    return res.status(404).send({ message: "Name not found" });

  const { ok } = await checkOwnership({
    req,
    res,
    resourceCreatorId: individualname.createdby,
  });
  if (!ok) {
    return;
  }

  try {
    // update other fields
    individualname.content = name;
    individualname.notes = description;

    // create a Set of existing tag strings for quick lookup
    const existingTagStrings = new Set(
      individualname.tags.map((t) => t.toString()),
    );

    // filter out any new tags that already exist
    const newTagsToAdd = tagsAsObjectIds.filter(
      (t) => !existingTagStrings.has(t.toString()),
    );

    // append new tags in order
    individualname.tags.push(...newTagsToAdd);

    await individualname.save();

    res.send({ message: "Name updated successfully", data: individualname });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

export default handler;

//like / dislike a post

// https://github.com/safak/youtube/blob/mern-social-app/api/routes/posts.js
// router.put("/:id/likedby", async (req, res) => {
//     try {
//       const post = await name.findById(req.params.id);
//       if (!name.likedby.includes(req.body.userId)) {
//         await post.updateOne({ $push: { likes: req.body.userId } });
//         res.status(200).json("The post has been liked");
//       } else {
//         await post.updateOne({ $pull: { likedby: req.body.userId } });
//         res.status(200).json("The post has been disliked");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
