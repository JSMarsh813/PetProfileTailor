"use client";

import { useEffect } from "react";

export default function MarkThanksRead() {
  useEffect(() => {
    fetch("/api/thanksmark-read", { method: "PATCH" }).catch((err) =>
      console.error("Failed to mark notifications as read:", err),
    );
    console.log("");
  }, []);

  return null;
}
