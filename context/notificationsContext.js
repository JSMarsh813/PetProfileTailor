"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const NotificationsContext = createContext(null);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  return context;
}

export function NotificationsProvider({ children }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [notifications, setNotifications] = useState({
    names: 0,
    descriptions: 0,
    thanks: 0,
  });

  const [timeGrabbed, setTimeGrabbed] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!userId) {
      // Clear notifications when logged out
      setNotifications({ names: 0, descriptions: 0, thanks: 0 });
      setTimeGrabbed(null);
      return;
    }

    fetch("/api/user/notifications", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setNotifications({
          names: data.names || 0,
          descriptions: data.descriptions || 0,
          thanks: data.thanks || 0,
        });
        setTimeGrabbed(new Date());
      })
      .catch(console.error);
  }, [userId, status]);

  const notificationsTotal =
    notifications.names + notifications.descriptions + notifications.thanks;

  const resetNotificationType = (type) => {
    const urlMap = {
      thanks: "/api/notifications/thanks/mark-read",
      descriptions: "/api/notifications/descriptions/mark-read",
      names: "/api/notifications/names/mark-read",
    };

    if (urlMap[type]) {
      fetch(urlMap[type], { method: "PATCH" }).catch((err) =>
        console.error("Failed to mark notifications as read:", err),
      );
    }

    setNotifications((prev) => ({
      ...prev,
      [type]: 0,
    }));
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        notificationsTotal,
        timeGrabbed,
        resetNotificationType,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
