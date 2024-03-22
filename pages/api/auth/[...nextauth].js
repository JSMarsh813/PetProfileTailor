import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
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

function html({ url, host, theme }) {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme ? theme.brandColor : "#4a148c";
  const color = {
    background: "#fff",
    text: "#310047",
    mainBackground: "#fff",
    buttonBackground: "#fff176",
    buttonBorder: "#553c9a",
    buttonText: "#553c9a",
    lightBackground: "#6237A0",
  };
  //url will be  https://u32281321.ct.sendgrid.net/ls/click?upn=km2wS9gGLS21G4zAhFatKE-2BJ7NrexSIBldeWIGo02tbAvkxEvim4iBZUI1gau5eiWMS92SmeHcdsFXKruncbmNDiosUNK-2BFFkbfs1fGgVMPyDYWtx65QAO2fJ7Kd9GV13PEZbVFBezREnmgA7P7br3lMHiQxYtw4n1vXBAE9f0K17-2BWurYJlrgoXtyPfilpaU8WMQcZJ1GyICq-2FKSRHxF7yLUqZHuqXJYOFNZBbV0BD4NXi0kGmU-2FUO46VEwpjMtTT2GUNZ4zqjomcoF9J1LbR2Gud2zf30d85jWbBFtRmOFOMz5XVVAbFXsqhMD-2BfMdoFd7_IhdrsEjW6Q2PibUpilKNtoR7miOY5hugQQFyEeK8OHfmBv-2BAOWr01Fp2eVHzKfsvLw-2BYIh-2FruwCrxRvDcw2mfW7mnjew5BEHEP2ti-2BvBTeqpmP5Obo-2Bpc3XmQGXvTEMil1FqNby9faTX0Ruhv3nTU4TJLhP269KxcwDIkhjs0EiGXhjk-2BN9V-2FTodmGmOvE2fX-2BqV3sRX-2FD1LX2aiLO2DYV69TD0AeJewaXsB16J75J4-3D

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 26px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Tap the button below to sign into <strong>${escapedHost}</strong>!
    
      </td>
    </tr>
    <tr>
     <td  align="center" >
    <img src="cid:unique@nodemailer.com"
       style="display: inline-block; margin: auto"
       alt="gif of a dog pressing a red button that turns a lightbulb green"/>
      </td>
</tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
   
          <tr>
      

            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
              
                style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 20px 40px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
  
    <tr>
    <td bgColor="#301934"; style="border:solid 20px #301934; padding-top:20px; padding-bottom:10px">
    <div align="center"
   style="background:#301934;border: 20px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #fff;">     
      
      <span style="padding: 20px 5px">
      Want to change your password?
      </span>

      <p style="padding: 10px 5px; border-bottom: 10px solid #301934">
      Click on the sign in button above. Then click on the downwards arrow next to your user profile image. Click on settings.
      </p>

      <img src="cid:instructions"
      style="display: inline-block; margin: auto"
      alt=""/>
     </td>

    </div>

    <p align="center"
    style="padding: 10px 0px 0px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #fff;
    bgColor=#000033; border-top: 2px solid #fff"
    >

    If you did not request this email you can safely ignore it.
    </p>
  </td>
  </tr>

  
    
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

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
        // return "/magiclink" or "/dashbaord "led to "url constructor /magiclink is not a valid url" error
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
        return "/magiclink";
      } else {
        //#################### PASSWORD LOGIN INCORRECT
        //incorrect password gives proper "invalid email or password error message"
        //because if you look at providers... CredentialsProvider... if (user && bcryptjs.compareSync(credentials.password, user.password) is untrue then
        //then throw new Error("Invalid email or password");

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
            _id: user._id,
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
      //logic for the magic link,  database is required to create a magic link. I'm using mongoDB
      //host, port, user, pass are all generated from Sendgrid's Web API

      //this will send a verfication token to mongoDB in the verification_tokens collection AND to the email link the users given

      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      //sendVerificationRequest allows us to customize the magic link's email https://next-auth.js.org/providers/email#customising-emails, under the hood its using the nodemailer package
      async sendVerificationRequest({
        identifier: email,
        url,
        //provider grabs the "server" and "from" object from the outer function directly above this inner function
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const transport = createTransport(server);
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          //is calling the text function, which has the fallback for email clients that don't render html
          html: html({ url, host, email }),
          //is calling the html function which has the email's personalized html code
          attachments: [
            {
              filename: "buttonpressdog.gif",
              path: path.join(process.cwd(), `/public/buttonpressdog.gif`),
              cid: "unique@nodemailer.com", //same cid value as in the html img src
            },
            {
              filename: "settingsinstructions.png",
              path: path.join(
                process.cwd(),
                `/public/settingsinstructions.png`,
              ),
              cid: "instructions", //same cid value as in the html img src
            },
          ],
        });
      },
    }),
  ],
};

export default NextAuth(authOptions);
