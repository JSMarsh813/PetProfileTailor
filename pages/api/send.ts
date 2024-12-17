import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "../../components/EmailTemplates/email-header-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["janetspellman13@gmail.com"],
    subject: "Hello world",
    react: EmailTemplate({ firstName: "John" }),
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
};
