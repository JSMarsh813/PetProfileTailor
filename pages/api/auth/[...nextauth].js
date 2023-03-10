import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import User from '../../../models/User'
import db from '../../../utils/db';
// import clientPromise from "../auth/lib/mongodb"

export default NextAuth({
  session: {
    strategy: 'jwt',
       // Set to jwt in order for CredentialsProvider to work properly
    //https://next-auth.js.org/configuration/providers/credentials
    //https://github.com/nextauthjs/next-auth/issues/3970
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {

        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
      
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',            
          };
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
});
