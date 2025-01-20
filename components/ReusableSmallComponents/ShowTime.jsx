import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function ShowTime({ postDate, styling }) {
  //  #########   FORMATTING DATE  #################
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  //undefined that way it'll reset to the correct timezone based on the users computer
  // To use the browser's default locale, omit this argument or pass undefined. http://udn.realityripple.com/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
  //@58:00 he goes over the time https://www.youtube.com/watch?v=lyNetvEfvT0&ab_channel=WebDevSimplified

  let formattedPostDate = dateFormatter.format(Date.parse(postDate));

  return (
    <span suppressHydrationWarning>
      {/* suppressHydrationWarning for date difference between the us server and the browser set in spanish */}
      <FontAwesomeIcon
        icon={faClock}
        className={`mx-2 ${styling}`}
      ></FontAwesomeIcon>
      {formattedPostDate}
    </span>
  );
}
