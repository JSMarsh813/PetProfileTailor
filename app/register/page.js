"use client";

import React from "react";

import "@fortawesome/fontawesome-svg-core/styles.css";

import RegisterForm from "@/components/Register/RegisterForm";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function Register() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
    >
      <RegisterForm />
    </GoogleReCaptchaProvider>
  );
}
