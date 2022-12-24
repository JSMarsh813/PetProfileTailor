import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import User from '../../../models/usermodel'
import db from '../../../utils/db';
import clientPromise from "../auth/lib/mongodb"

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    jwt: true,
    strategy: 'jwt',
  },
  callbacks: {
    jwt: ({ token, user }) => {     
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  secret: "test",
  jwt: {
    secret: "test",
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
    credentials: {
      name: { label: "Username", type: "text", placeholder: "jsmith" },
      email: { label: "email", type: "text", placeholder: "jsmith@gmail.com" },
      password: {  label: "Password", type: "password" }
    },
      
      async authorize(credentials) {
        await db.connect();
        
         const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();     
         // this line is what compares the given password to the one in the database/links front and back end
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {

          return {
            _id: user._id,
            name: user.name,
            email: user.email,                     
          };
        }
     
        else {
        throw new Error('Invalid email or password');
      }
      },
      
    }),
  ],
});
