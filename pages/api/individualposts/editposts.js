import React from "react";
import { getSession } from "next-auth/react";
import Post from "../../../models/posts";
import db from "../../../utils/db";

export default async function editposts(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  //   const session = await getSession({ req });
  //   if (!session) {
  //     return res.status(401).send({ message: 'signin required' });
  //   }

  //createdby doesn't seem necessary
  const { image, title, description, createdby, taglist, postid } =
    req.body.postSubmission;

  console.log(req.body.postSubmission);

  await db.connect();

  const toUpdatePost = await Post.findById(postid);
  console.log(toUpdatePost);
  if (image) {
    toUpdatePost.image = image;
  }
  if (title) {
    toUpdatePost.title = title;
  }
  if (title) {
    toUpdatePost.title = title;
  }
  toUpdatePost.description = description;
  toUpdatePost.taglist = taglist;

  await toUpdatePost.save();
  await db.disconnect();
  res.send({
    message: "User updated",
  });
}
