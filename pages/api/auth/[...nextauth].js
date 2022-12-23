import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// 3:17 https://www.youtube.com/watch?v=wrTVseY13t8&ab_channel=ckmobile

// import { verifyPassword } from './lib/auth';// fix
// import { connectToDatabase } from '../../../config/connectmongodb';

import { MongoDBAdapter } from "@next-auth/mongodb-adapter" //for mongoDB
import clientPromise from "./lib/mongodb" //for mongoDB

import Users from "../../../models/usermodel"
import bcrypt from "bcrypt"
export default NextAuth({
 adapter: MongoDBAdapter(clientPromise), //for mongoDB

  session: {
    strategy: 'jwt', //?????
  }, 
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        const email=credentials.email;
        const password=credentials.password;
        const user= await Users.findOne({email})
        if (!user){
            throw new Error ("You haven't registered yet")
        }
        if (user){
              return signInUser({password,user})
        }
        
      }
    })
  ],
  pages: {
    signIn: "../../../pages/login",
    // signOut: '/auth/signout',
  },
  secret:"verySecret",
  database:process.env.MONGODB_URI
});

const signInUser = async({password,user})=>{
    if (!user.password){
        throw new Error("please enter a password")
    }
    const isMatch= await bcrypt.compare(password,user);
    if (isMatch){
        throw new Error("Password not correct")
    }
    return user

}