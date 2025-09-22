"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import LinkButton from "../ReusableSmallComponents/buttons/LinkButton";

export default function NotificationsButton({ onClick }) {
  return (
    <LinkButton
      href="/notifications"
      className="mr-2 py-[6px] px-[10px] rounded-full hover:bg-blue-500"
      icon={
        <FontAwesomeIcon
          icon={faBell}
          size="lg"
          className="text-subtleWhite "
        />
      }
    />
  );
}
