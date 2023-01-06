import { getSession } from 'next-auth/react';
import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  //session info
  const { user } = session;
  // the three things we're sending to update
  const { name, email, password } = req.body;
 

  //validation shouldn't be necessary since we're sending the session_id to attach to the selected object
  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();
  // use the model we're updating. Look through it to find the one document we're looking for with the name

  // so toUpdateName = await IndividualNames.findById(names._id);

  // now that we have the right name, lets check if it has the current id
  // if (toUpdateName.likedby.includes(user._id))

 //if true, lets filter it out
  // toUpdateName.likedby= toUpdateName.likedby.filter(user=> 
          //user.id!=user._id)

  // if false, lets add it to the database
  //toUpdateName.likedby=toUpdateName.likedby.concat(user._id)
  const toUpdateUser = await User.findById(user._id);
  toUpdateUser.name = name;
  toUpdateUser.email = email;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }

  await toUpdateUser.save();
  await db.disconnect();
  res.send({
    message: 'User updated',
  });
}

export default handler;
