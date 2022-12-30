import { getSession } from 'next-auth/react';
import bcryptjs from 'bcryptjs';
// import User from '../../../models/User'
import db from '../../../utils/db';

async function grabUserId(req, res) {

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).send({ message: 'signin required' });
    }
  
    const { user } = session;
   
  
  }
  export default grabUserId;