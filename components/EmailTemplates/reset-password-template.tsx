import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Heading,
  Img,
  Link,
} from "@react-email/components";

import * as React from "react";

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
          <Container
            style={{
              backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwgcQvnGvXImnEEIBManBL1e94rk9Qk9DfLw&s")`,
              backgroundRepeat: "none",
              backgroundSize: "cover",
              paddingBottom: "20px",
            }}
          >
            <Heading
              as="h3"
              style={companyname}
            >
              Tailored Pet Names
            </Heading>

            <Img
              src="https://media4.giphy.com/media/ZXwdJuk172dQwAqMGv/giphy.gif"
              height={100}
              alt="dog looking back and forth with question marks around them"
              style={{
                margin: "0 auto",
                borderRadius: "30%",
                border: "2px solid white",
              }}
            />

            <Heading style={heading}> Password Reset </Heading>
          </Container>
        </Container>

        <Container style={container}>
          <Section style={body}>
            <Text style={paragraph}>Hi {userFirstname},</Text>
            <Text style={paragraph}>
              Someone recently requested a password change for your Tailored Pet
              Names account. If this was you, you can set a new password here:
            </Text>

            <Link
              style={link}
              href={resetPasswordLink}
            >
              👉
              <text style={button}>Click to reset password </text> 👈
            </Link>

            <Text style={paragraph}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={paragraph}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
          </Section>
          <Container style={coloredcontainer}>
            <Text style={footer}>Tailored Pet Names</Text>
          </Container>
        </Container>
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

const button = {
  background: "rgba(124,58,237,1)",
  backgroundSize: "auto 90px",
  border: "2px solid transparent",
  borderRadius: "20px",
  boxShadow: "rgba(255, 255, 255, .5) 0 2px 0 0 inset",
  color: "#fff",
  display: "inline-block",
  margin: "0 10px",
  padding: "14px 2em",
};

const heading = {
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px auto",
  color: "white",
};

const body = {
  margin: "24px 0",
  fontSize: "16px",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const link = {
  color: "#FF6363",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "white",
  fontSize: "12px",
};

const companyname = {
  color: "white",
  fontSize: "1.4rem",
  background: "rgba(124,58,237,1)",
  padding: "12px 0",
  border: "1px solid white",
};

const coloredcontainer = {
  background: "rgba(124,58,237,1)",
  backgroundSize: "auto 90px",
};

//to override the default text style, setting fontsize in higher up element won't override the default text formatting
const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};
