import { SendVerificationRequestParams } from "next-auth/providers";
import { Resend } from "resend";
import { MagicLinkTemplate } from "@components/EmailTemplates/magic-link-template";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  let { identifier: email, url, provider } = params;
  // console.log(params);
  try {
    await resend.emails.send({
      from: `${process.env.RESEND_EMAIL_FROM}`,
      to: email,
      subject: "Login Link to your Account",
      react: MagicLinkTemplate({
        magicLink: url,
        email,
      }),
    });
  } catch (error) {
    console.error({ error });
  }
};

// to: ["janetspellman13@gmail.com"],
// from: "onboarding@resend.dev",
// subject: `Sign in to ${host}`,
// react: MagicLinkTemplate({
//   magicLink: "testing",
// }),
// });
// },
