import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import User from "@models/User";
// import NameTag from "../../../models/NameTag";
import db from "@utils/db";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/pages/api/auth/lib/mongodb";

import { sendVerificationRequest } from "@/lib/send-verification-request";

export const serverAuthOptions = {
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

      try {
        await db.connect();
        const userExists = await User.findOne({
          email: user.email, //the user object has an email property, which contains the email the user entered.
        });

        if (!userExists) return "/login?error=UserNotFound";

        if (userExists.status === "banned") {
          // for magic link users that are banned
          return "/login?error=Banned";
        }

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
      } catch (err) {
        console.error("Error in signIn callback:", err);

        // Optionally, redirect to a friendly error page
        return "/login?error=DBUnavailable";
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
          role: user.role,
          status: user.status,
        };
      }

      try {
        const userCheck = await User.findById(token.user?.id).select("status");

        // console.log("user in nexAuth", userCheck);
        if (!userCheck || userCheck.status === "banned") {
          // console.log("in next auth", userCheck, userCheck.status);
          // strip user data so session() will return null
          return {};
        }
      } catch (err) {
        console.error("DB unavailable in jwt callback:", err);
        return {};
      }

      return token;
    },
    async session({ session, token }) {
      // session is always an object, token is always an object
      // token.user may or may not exist
      if (token.user) {
        // Only expose safe fields in session, aka what we listed above in the token
        session.user = token.user;
      }
      // session.user might still be undefined if token.user was missing
      if (!session.user) return null;

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

        if (!user) throw new Error("Invalid email or password");

        if (user.status === "banned") {
          throw new Error("This account has been banned. Contact support.");
        }

        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            id: user._id,
            // use id that way it will be normalized with the magic login sign on, which creates user.session.id instead of user.session._id
            name: user.name,
            profilename: user.profilename,
            email: user.email,
            profileimage: user.profileimage,
            role: user.role,
            status: user.status,
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
