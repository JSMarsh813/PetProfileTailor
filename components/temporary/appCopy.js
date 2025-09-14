import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import User from "@models/User";
// import NameTag from "../../../models/NameTag";
import db from "@utils/db";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/pages/api/auth/lib/mongodb";

import { sendVerificationRequest } from "@/pages/api/auth/utils/send-verification-request";

export const serverAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await db.connect();
      const userExists = await User.findOne({
        email: user.email,
      });

      // ######################## MAGIC ID  Magic link submits to
      console.log(`this is user ${JSON.stringify(user)}`);

      if (userExists && account.provider == "credentials") {
        return true;
      } else if (userExists && account.provider == "email") {
        return true;
      } else {
        return "/magiclink";
      }
    },
    async jwt({ token, user }) {
      // Only populate the token on first sign in
      if (user) {
        token.user = {
          id: user.id || user._id,
          name: user.name,
          profilename: user.profilename,
          bioblurb: user.bioblurb || "",
          location: user.location || "",
          profileimage: user.profileimage,
          followers: user.followers || [],
          blockedusers: user.blockedusers || [],
        };
      }
      return token;
    },
    async session({ session, token }) {
      //used to be session, user, token
      if (token) {
        // Only expose safe fields in session, aka what we listed above in the token
        session.user = token.user;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      // if email and password match, sign in
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });

        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            id: user._id,

            name: user.name,
            profilename: user.profilename,
            email: user.email,
            profileimage: user.profileimage,
          };
        }
        throw new Error("Invalid email or password");
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.RESEND_EMAIL_FROM,

      sendVerificationRequest,
    }),
  ],

  pages: {
    verifyRequest: "/magiclink",
  },
};
