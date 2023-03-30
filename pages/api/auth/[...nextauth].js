import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import User from "../../../models/User";
import { createTransport } from "nodemailer";
// import NameTag from "../../../models/NameTag";
import db from "../../../utils/db";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../auth/lib/mongodb";

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

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Tap the button below to sign into <strong>${escapedHost}</strong>!
    
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 40px 0;">
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
    <td align="center"
    bgcolor="${color.lightBackground}"
      style="padding: 10px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #fff;">

      <span style="padding: 10px 0px">
      Want to change your password?
      </span>

      <p style="padding: 10px 0px">
      Click on the button. Then click on the downward arrow next to your user profile to activate the dropdown. Click on settings.
      </p>


    </td>
  </tr>

    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
   
        If you did not request this email you can safely ignore it.
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
    jwt({ token, user }) {
      if (user) token = user;
      return token;
    },
    session({ session, token }) {
      //used to be session, user, token
      session.user = token;
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
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const transport = createTransport(server);
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        });
      },
    }),
  ],
};

export default NextAuth(authOptions);
