"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Link from "next/link";

export default function NotificationsButton() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadLikesCount, setUnreadLikesCount] = useState(0);

  useEffect(() => {
    async function fetchUnread() {
      console.log("fetch unread ran");
      try {
        // **************** Thanks ************************//
        const thanksRes = await fetch("/api/thanks/get-thanks-count");
        const thanksData = await thanksRes.json();
        setUnreadCount(thanksData.count);

        // *************** Likes **************************
        // const nameLikesRes = await fetch("/api/names/___")
        // const nameLikesdata = await nameLikesRes.json()
        // const descriptionLikesRes = await fetch("/api/names/___")
        // const descriptionLikesdata = await descriptionLikesRes.json()
        // setUnreadLikesCount(descriptionLikesdata.count + nameLikesdata.count)
      } catch (err) {
        console.error("fetchUnread failed:", err);
      }
    }

    fetchUnread();
    console.log("unreadCount", unreadCount);
    const interval = setInterval(fetchUnread, 60 * 60 * 1000); // refresh every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/notifications"
      className={` className="mr-2 py-[6px] px-[10px] rounded-full hover:bg-blue-500 `}
    >
      <section className="relative inline-block">
        <FontAwesomeIcon
          icon={faBell}
          size="lg"
          className="text-subtleWhite "
        />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-3 text-xs text-subtleWhite px-2 bg-blue-700 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </section>
    </Link>
  );
}
