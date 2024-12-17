import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import * as React from "react";
import EmailHeaderTemplate from "./EmailTemplateComponents/email-header-template";
import EmailFooterTemplate from "./EmailTemplateComponents/email-footer-template";
import EmailButtonTemplate from "./EmailTemplateComponents/email-button";

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

export const ResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview> Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailHeaderTemplate
            headerText="Password Reset"
            imgLink="https://media1.tenor.com/m/RFMH39za-H4AAAAd/press-the-pack.gif"
            imgAltText="dog looking back and forth with question marks around them"
          ></EmailHeaderTemplate>
        </Container>

        <Container style={container}>
          <Section style={body}>
            <Text style={paragraph}>Hi {userFirstname},</Text>
            <Text style={paragraph}>
              Someone recently requested a password change for your Tailored Pet
              Names account. If this was you, you can set a new password here:
            </Text>

            <EmailButtonTemplate
              buttonHref={resetPasswordLink}
              buttonText="Click to reset password"
            ></EmailButtonTemplate>

            <Text style={paragraph}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, you can ignore and delete this message.
            </Text>
            <Text style={paragraph}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
          </Section>
        </Container>
        <EmailFooterTemplate></EmailFooterTemplate>
      </Body>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  userFirstname: "Alan",
  resetPasswordLink: "https://.com",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
};

const container = {
  margin: "0 auto",

  textAlign: "center" as "center",
};

const body = {
  margin: "24px 0",
  fontSize: "16px",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

//to override the default text style, setting fontsize in higher up element won't override the default text formatting
const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};
