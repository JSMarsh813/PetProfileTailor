import { getSession } from 'next-auth/react';
import NameComment from '../../../models/namecomment'
import db from '../../../utils/db';
const mongoose = require('mongoose');


async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;


  const commentId = req.body.currentTargetedId;  

  let idToObjectId = mongoose.Types.ObjectId(commentId)

  await db.connect();
  
  const toUpdateComment = await NameComment.findById(idToObjectId);
 
  toUpdateComment.likedby.includes(user._id)? 

        (toUpdateComment.likedby= toUpdateComment.likedby.filter(userinlikedby=> 
          userinlikedby!=user._id)):

        (toUpdateComment.likedby=toUpdateComment.likedby.concat(user._id))
      

  await toUpdateComment.save();
  await db.disconnect();
  res.send({
    message: 'Comments likes updated',
  });
      
  //if statement 

}

export default handler;
