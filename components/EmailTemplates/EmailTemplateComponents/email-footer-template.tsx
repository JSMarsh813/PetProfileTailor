import { Container, Text } from "@react-email/components";

import * as React from "react";

interface EmailFooterTemplateProps {}

export const EmailFooterTemplate = () => (
  <Container style={coloredcontainer}>
    <Text style={footer}>Tailored Pet Names</Text>
  </Container>
);

export default EmailFooterTemplate;

EmailFooterTemplate.PreviewProps = {} as EmailFooterTemplateProps;

const footer = {
  color: "white",
  fontSize: "12px",
  textAlign: "center" as const,
};

const coloredcontainer = {
  background: "rgba(124,58,237,1)",
  backgroundSize: "auto 90px",
};
