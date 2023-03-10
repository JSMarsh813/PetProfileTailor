import { getSession } from 'next-auth/react';
import Post from '../../../models/posts'
import db from '../../../utils/db';
const mongoose = require('mongoose');


async function handler(req, res) {
  const commentid=req.body.commentid
  const postid=req.body.postid
  let idToObjectId = mongoose.Types.ObjectId(postid)

  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  //session info
  const { user } = session;
 
  await db.connect();
  const postToUpdate = await Post.findById(idToObjectId)
 
  postToUpdate.comments.push(commentid)
 
  await postToUpdate.save();
  await db.disconnect();
  res.send({
    message: 'comment id added to post',
  });


}

export default handler;
