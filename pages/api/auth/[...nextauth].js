import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import User from "../../../models/User";
import { createTransport } from "nodemailer";
// import NameTag from "../../../models/NameTag";
import db from "../../../utils/db";
import path from "path";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../auth/lib/mongodb";
import { ConnectionClosedEvent } from "mongodb";
import nodemailer from "nodemailer";
import { MagicLinkTemplate } from "../../../components/EmailTemplates/magic-link-template";

import { sendVerificationRequest } from "../auth/utils/send-verification-request";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    // Set to jwt in order for CredentialsProvider to work properly
    //https://next-auth.js.org/configuration/providers/credentials
    //https://github.com/nextauthjs/next-auth/issues/3970
  },
  callbacks: {
    //PASSWORD && EMAIL CALLS CREDENTIALS PROVIDER ==> SUBMIT button event ==>
    //   await signIn("credentials", ....)
    //aka think of it as "/api/auth/sigin/credentialsProvider"

    //MAGIC LINK CALLS EMAIL PROVIDER ==> SUBMIT BUTTON ==> FORM method="post" action="/api/auth/signin/email"

    async signIn({ user, account, profile, email, credentials }) {
      //https://next-auth.js.org/providers/email parameter names from https://next-auth.js.org/configuration/callbacks
      //checking if the email exists in the database, if it does, allow user to signin
      await db.connect();
      const userExists = await User.findOne({
        email: user.email, //the user object has an email property, which contains the email the user entered.
      });

      // ######################## MAGIC ID  Magic link submits to
      console.log(`this is user ${JSON.stringify(user)}`);
      //this is user {"id":"642ff957967ccc12cb6a66e3","name":"test","profilename":"test","email":"kyunyu@gmail.com","password":"$2a$10$rM/Wey8Ozj0v5AjlZovu5uQuv8attFIEazY2JNmR24NpV6IEZH0na","blockedusers":[],"followers":[],"bioblurb":"test","location":"somewhere","profileimage":"https://res.cloudinary.com/dujellms1/image/upload/v1680869990/profileimage/ypfn3bcukspvfcc6qyyc.jpg","createdAt":"2023-04-07T11:07:03.089Z","updatedAt":"2024-03-07T05:06:56.646Z","__v":16,"passwordresettoken":"d815dd793f58a8a84d146735399ce513460dcda981745a9ed598b8ed27aa44a1","resettokenexpires":"2024-03-07T05:12:01.846Z"}
      //this is profile undefined
      //this is account {"providerAccountId":"kyunyu@gmail.com","userId":"kyunyu@gmail.com","type":"email","provider":"email"}
      //this is email {"verificationRequest":true}
      //this is credentials undefined

      // #################### EMAIL AND PASSWORD SIGN IN
      //this is user {"_id":"642ff957967ccc12cb6a66e3","name":"test","profilename":"test","email":"kyunyu@gmail.com","profileimage":"https://res.cloudinary.com/dujellms1/image/upload/v1680869990/profileimage/ypfn3bcukspvfcc6qyyc.jpg"}
      //this is profile undefined
      // this is account {"type":"credentials","provider":"credentials"}
      // this is email undefined
      //this is credentials {"redirect":"false","email":"kyunyu@gmail.com","password":"testtest","csrfToken":"dd5916a6f692c53adc7b83b079561be41846172f2f9ab506fc07287f5c64a094","callbackUrl":"http://localhost:3000/login","json":"true"}

      if (userExists && account.provider == "credentials") {
        return true;
        // return "/magiclink" or "/dashboard "led to "url constructor /magiclink is not a valid url" error
        // if the email exists in the User collection, email them a magic login link

        //if login pages const result = await signIn("credentials", {  redirect: callbackUrl:"dashboard"  &&& above is return true && auto redirect logic taken out of login page

        //IF CORRECT LOGIN ===> results in undefined toast message but sends to dashboard/user is logged in
        //IF INCORRECT sends user to a nextJS basic error page
        //so its better to have redirect:false so we can handle any errors on the page itself
        // as seen here https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
        //so instead we have return true && start a session, which triggers the login.js page's useEffect to redirect to the dashboard

        //login.js page logic redirects user to dashboard on successful signin/session start
        //         useEffect(() => {
        //   if (session?.user) {
        //     router.push("/dashboard");
        //   }
        // }, [router, session, redirect]);
        //   },
        // };
      } else if (userExists && account.provider == "email") {
        //if the email exists in the database
        //this them jumps down to the EmailProvider logic, which we set up to work with resend
        //it then runs sendVerificationRequest logic stored in auth/utils
        //the async sendVerificationRequest function says "hey lets use resend to send an email with a magic link inside it"

        return true;
        //  https://next-auth.js.org/providers/email#customizing-emails
      } else {
        //incorrect email to magic links (aka email not found in the database) sends to /magiclnk
        return "/magiclink";
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token = user;
      }
      return token;
    },
    async session({ session, token }) {
      //used to be session, user, token
      if (token) {
        session.user = token;
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
            // use id that way it will be normalized with the magic login sign on, which creates user.session.id instead of user.session._id
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
      // this allows us to add to the email provider object
      // however some provider properties aren't editable here
      //for example the callbackurl for the magiclink login (the verifyRequest page), can't be changed here, you have to jump down to the pages section to overwrite next-auth's default callbackUrl to the verify reuqest page for email/magic link login
      // provider: {
      //   id: 'email',
      //   type: 'email',
      //   name: 'Email',
      //   server: { host: 'smtp.resend.com', port: '465', auth: [Object] },
      //   from: 'no-reply@tailoredpetnames.com',
      //   maxAge: 86400,
      //   sendVerificationRequest: [AsyncFunction: sendVerificationRequest],
      //   signinUrl: 'http://localhost:3000/api/auth/signin/email',
      //   callbackUrl: 'http://localhost:3000/api/auth/callback/email'
      // },

      //logic for the magic link,  database is required to create a magic link. I'm using mongoDB
      //this will send a verfication token to mongoDB in the verification_tokens collection AND to the email link the users given
      //server sets up our connection with resend, we use the env variables that resend gave us
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.RESEND_EMAIL_FROM,
      //sendVerificationRequest allows us to customize the magic link's email https://next-auth.js.org/providers/email#customising-emails, under the hood its using the nodemailer package
      sendVerificationRequest,
    }),
  ],
  //overwrite the default pages with personalize pages
  //https://next-auth.js.org/configuration/pages
  pages: {
    verifyRequest: "/magiclink",
  },
};

export default NextAuth(authOptions);
