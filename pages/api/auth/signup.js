import bcryptjs from 'bcryptjs';
import User from '../../../models/User'
import db from '../../../utils/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const { name, email, password, profilename } = req.body;
  if (
    !name ||
    !email ||
    !profilename||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();
             //tests for existing user
  const existingEmail = await User.findOne({ email: email });
  if (existingEmail) {
    res.status(422).json({ message: 'Email is already used!' });
    await db.disconnect();
    return;
  }
  
  const existingUserProfile = await User.findOne({ profilename: profilename});
  if (existingUserProfile) {
    res.status(422).json({ message: 'That profile name is already used!' });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    profilename,
    password: bcryptjs.hashSync(password),
      });

  const user = await newUser.save();
   //create new user with .save from mongoose
  
  await db.disconnect();
   //disconnect from database then send a successful response
  res.status(201).send({
    message: 'Created user!',
    _id: user._id,
    profilename: user.profilename,
    name: user.name,
    email: user.email,
    
  });

  
}

export default handler;
