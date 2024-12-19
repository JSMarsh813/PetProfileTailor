import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import * as React from "react";
import EmailHeaderTemplate from "./EmailTemplateComponents/email-header-template";
import EmailFooterTemplate from "./EmailTemplateComponents/email-footer-template";
import EmailButtonTemplate from "./EmailTemplateComponents/email-button";

interface MagicLinkTemplateProps {
  notificationText?: string;
  email?: string;
}

export const MagicLinkTemplate = ({
  notificationText,
}: MagicLinkTemplateProps) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link.</Preview>
    <Body style={main}>
      <EmailHeaderTemplate
        headerText="Magic Link"
        imgLink="https://media1.tenor.com/m/RFMH39za-H4AAAAd/press-the-pack.gif"
        imgAltText="image of a dog with sunglasses clicking a button which turns on a green lightbulb"
      ></EmailHeaderTemplate>

      <Container style={container}>
        <Section style={body}>
          <Text style={paragraph}>
            Your username was recently updated from formerusername to username.
            If this was not done by you, please contact us at ____.
          </Text>

          <text style={paragraph}>
            If your account information was not changed by you, we recommend 1.
            securing your account by logging out of all devices by clicking:
            signout logic, edits session token to be expired session 2. login
            with a magic login link, give link, and change your password
          </text>
        </Section>
      </Container>

      <EmailFooterTemplate></EmailFooterTemplate>
    </Body>
  </Html>
);

MagicLinkTemplate.PreviewProps = {
  magicLink: "https://raycast.com",
  email: "test@gmail.com",
} as MagicLinkTemplateProps;

export default MagicLinkTemplate;

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
