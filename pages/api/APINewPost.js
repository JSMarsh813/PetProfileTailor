import Post from "../../models/posts";
import db from "../../utils/db";

async function APINewPost(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const { image, title, description, createdby, taglist, alttext } = req.body;

  if (!description || !taglist || !createdby) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await db.connect();

  const newPost = new Post({
    image,
    title,
    description,
    taglist,
    createdby,
    alttext,
  });

  const post = await newPost.save();
  //create new user with .save from mongoose

  res.status(201).send({
    message: "Created post!",

    _id: post._id,
    image: post.image,
    title: post.title,
    description: post.description,
    tagList: post.taglist,
    createdby: post.createdby,
    alttext: post.alttext,
  });
}

export default APINewPost;
