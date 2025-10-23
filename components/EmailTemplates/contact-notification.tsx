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

interface ContactEmailProps {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactNotification = ({
  name,
  email,
  message,
}: ContactEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview> Contact Submission</Preview>
      <Body style={main}>
        <EmailHeaderTemplate headerText="Contact"></EmailHeaderTemplate>

        <Container style={container}>
          {/* needs to be in a container, so the text does not spill out to the left and right */}
          <Section style={body}>
            <Text style={paragraph}>From user {name},</Text>

            <Text style={paragraph}>
              We’ve received your message and will get back to you soon.
            </Text>
            <Text style={paragraph}>Here is a copy of their submission.</Text>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Message:</strong>
            </p>
            <p>{message}</p>
          </Section>
        </Container>
        <EmailFooterTemplate></EmailFooterTemplate>
      </Body>
    </Html>
  );
};

export default ContactNotification;

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
  fontWeight: "300",
  color: "#404040",
};

//to override the default text style, setting fontsize in the parent elements won't override the default text formatting
const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};
