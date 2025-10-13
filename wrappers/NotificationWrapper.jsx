"use client";
import { useEffect, useState } from "react";

import { NotificationsProvider } from "@/context/notificationsContext";

export default function NotificationsWrapper({ children }) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}
