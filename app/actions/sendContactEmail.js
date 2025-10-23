"use server";

import { Resend } from "resend";
import ContactEmailCopy from "@/components/EmailTemplates/contact-copy-to-submitter";
import ContactNotification from "@/components/EmailTemplates/contact-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const captchaToken = formData.get("captchaToken");

  // Basic validation
  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." };
  }

  const captchaVerify = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      }),
    },
  );
  const captchaData = await captchaVerify.json();

  if (!captchaData.success || (captchaData.score && captchaData.score < 0.5)) {
    return {
      success: false,
      error: "reCAPTCHA failed. Please try again.",
      email,
    };
  }
  try {
    const from = process.env.RESEND_EMAIL_FROM;
    const adminEmail = process.env.RESEND_FROM_GMAIL;

    const [userRes, adminRes] = await Promise.all([
      resend.emails.send({
        from,
        to: email,
        replyTo: adminEmail,
        subject: `Thanks for your message, ${name}`,
        react: ContactEmailCopy({ name, email, message }),
      }),
      resend.emails.send({
        from,
        to: adminEmail,
        replyTo: email,
        subject: `New message from ${name}`,
        react: ContactNotification({ name, email, message }),
      }),
    ]);

    if (userRes.error || adminRes.error) {
      console.error("Resend errors:", userRes.error, adminRes.error);
      return {
        success: false,
        error: "One or more emails failed to send.",
        email,
      };
    }

    return { success: true, error: null, email };
  } catch (error) {
    console.error("Resend error:", error);
    return { success: false, error: "Failed to send email.", email };
  }
}
