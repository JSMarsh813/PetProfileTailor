"use client";

import { createContext, useContext, useState, useEffect } from "react";

const NotificationsContext = createContext(null);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  return context;
}

export function NotificationsProvider({ children, initialNotifications = {} }) {
  const [notifications, setNotifications] = useState({
    names: 0,
    descriptions: 0,
    thanks: 0,
  });

  const [timeGrabbed, setTimeGrabbed] = useState(null);

  useEffect(() => {
    if (initialNotifications) {
      setNotifications({
        names: initialNotifications.names || 0,
        descriptions: initialNotifications.descriptions || 0,
        thanks: initialNotifications.thanks || 0,
      });
      setTimeGrabbed(new Date());
    }
  }, [initialNotifications]);

  const notificationsTotal =
    notifications.names + notifications.descriptions + notifications.thanks;

  const resetNotificationType = (type) => {
    const urlMap = {
      thanks: "/api/notifications/thanks/mark-read",
      //app\api\notifications\thanks\mark-read\route.js
      descriptions: "/api/notifications/description/likes/mark-read",
      // app\api\notifications\descriptions\mark-read
      names: "/api/notifications/names/likes/mark-read",
      // app\api\notifications\names\mark-read\route.js
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
