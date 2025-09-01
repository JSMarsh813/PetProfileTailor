import React from "react";

export default function ParagraphRenderBasedOnStringProperty({
  content,
  text,
}) {
  return (
    <p className="whitespace-pre-line mt-2">
      {content.description && content.description}
    </p>
  );
}
