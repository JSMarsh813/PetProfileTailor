import { Resend } from "resend";
import type { NextApiRequest, NextApiResponse } from "next";
import { SendVerificationRequestParams } from "next-auth/providers";
import { EmailTemplate } from "../../../../components/EmailTemplates/email-header-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "janetspellman13@gmail.com",
    subject: "Hello world",
    react: EmailTemplate({ firstName: "John" }),
  });

  if (error) {
    return res.status(400).json(error);
  }

  return res.status(200).json(data);
}
