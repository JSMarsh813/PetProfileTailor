import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface MagicLinkTemplateProps {
  magicLink?: string;
  email?: string;
}

export const MagicLinkTemplate = ({
  magicLink,
  email,
}: MagicLinkTemplateProps) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Container
          style={{
            backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwgcQvnGvXImnEEIBManBL1e94rk9Qk9DfLw&s")`,
            backgroundRepeat: "none",
            backgroundSize: "cover",
          }}
        >
          <Heading
            as="h3"
            style={companyname}
          >
            Tailored Pet Names
          </Heading>

          <Img
            src="https://media1.tenor.com/m/RFMH39za-H4AAAAd/press-the-pack.gif"
            height={140}
            alt="image of a dog with sunglasses clicking a button which turns on a green lightbulb"
            style={{
              margin: "0 auto",
              borderRadius: "30%",
              border: "2px solid white",
            }}
          />

          <Heading style={heading}> Magic Link </Heading>
        </Container>

        <Section style={body}>
          <Link
            style={link}
            href={magicLink}
          >
            👉
            <text style={button}>Click to sign in </text> 👈
          </Link>

          <Text style={paragraph}>
            This email was intended for {email}. If you didn&apos;t request this
            email, you can ignore this email.
          </Text>
        </Section>

        <Container style={coloredcontainer}>
          <Text style={footer}>Tailored Pet Names</Text>
        </Container>
      </Container>
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
