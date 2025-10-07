"use client";
import { useEffect, useState } from "react";

import { NotificationsProvider } from "@/context/notificationsContext";

export default function NotificationsWrapper({ children }) {
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    fetch("/api/user/notifications", { cache: "no-store" })
      .then((res) => res.json())
      .then(setNotifications)
      .catch(console.error);
  }, []);

  return (
    <NotificationsProvider initialNotifications={notifications}>
      {children}
    </NotificationsProvider>
  );
}
