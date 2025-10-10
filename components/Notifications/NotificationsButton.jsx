"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "@/context/notificationsContext";
import "@fortawesome/fontawesome-svg-core/styles.css";

import IconBadge from "../ReusableSmallComponents/IconWithCount";

export default function NotificationsButton() {
  const { notifications, setNotifications, notificationsTotal, timeGrabbed } =
    useNotifications();

  const [unreadCount, setUnreadCount] = useState(notificationsTotal);

  useEffect(() => {
    setUnreadCount(notificationsTotal);
  }, [notificationsTotal]);

  return (
    <Link
      href="/notifications"
      className={` className="mr-2 py-[6px] px-[10px] rounded-full hover:bg-blue-500 `}
    >
      <IconBadge
        icon="faBell"
        count={unreadCount}
      />
    </Link>
  );
}
