"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import GeneralButton from "components/ReusableSmallComponents/buttons/GeneralButton";

export default function GoToTopButton({ top }) {
  const [isVisible, setIsVisible] = useState(false);

  // show button only after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300); // show after 300px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <>
          <GeneralButton
            aria-label="Go to top"
            onClick={scrollToTop}
            className="fixed bottom-16 right-6 py-3 px-5 rounded-full transition"
          >
            <FontAwesomeIcon
              size="xl"
              icon={faArrowUp}
            />
          </GeneralButton>
        </>
      )}
    </>
  );
}
