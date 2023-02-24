import { getSession } from 'next-auth/react';
import User from '../../../models/User'
import db from '../../../utils/db';
const cloudinary = require('cloudinary').v2

async function handler(req, res) {
  console.log(req.body)

  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  //session info
  const { user } = session;
 
  // no req is appearing in console...

  const { newProfileImage } = req.body;
 
  await db.connect();
  const toUpdateUser = await User.findById(user._id);
  toUpdateUser.profileimage= newProfileImage
 
  await toUpdateUser.save();
  await db.disconnect();
  res.send({
    message: 'Profile Image updated',
  });


}

export default handler;
