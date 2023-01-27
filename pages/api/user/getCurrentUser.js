import User from "../../../models/User"
import db from '../../../utils/db'
import { getSession } from 'next-auth/client';
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { connectToDatabase } from '../auth/lib/db';

async function handler(req, res) {
    if (req.method !== 'GET') {
      return;
    }
    // https://next-auth.js.org/configuration/nextjs
     const session = await unstable_getServerSession(req, res, authOptions)
  
    if (!session) {
      res.status(401).json({ message: 'Not authenticated!' });
      return;
    }
  
    const userId = session.user._id;
     
    
    try {
     
      const client = await connectToDatabase();

      // await db.connect("users");   
      const usersCollection = client.db().collection('users');

      const user = await usersCollection.findOne({ _id: userId});
      // const users = await User.findOne({ _id: userId });
      return user
     
    } catch (error) {
      console.log(error);

      return {
        notFound: true,
      };
     
    }
    client.close();
    res.status(200).json({ message: 'user found!' });
  };
  
    // const usersCollection = client.db().collection('users');
  
    // const user = await usersCollection.findOne({ email: userEmail });
  
    // if (!user) {
    //   res.status(404).json({ message: 'User not found.' });
    //   client.close();
    //   return;
    // }
  

    // client.close();
    // res.status(200).json({ message: 'profile Image grabbed!' });
  
  
  export default handler;