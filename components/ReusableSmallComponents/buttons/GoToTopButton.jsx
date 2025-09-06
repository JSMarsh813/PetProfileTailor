import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import GeneralButton from "./GeneralButton";

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
            children={
              <>
                <FontAwesomeIcon icon={faArrowUp} />
                <span className="block tracking-wider"> Top</span>
              </>
            }
            aria-label="Go to top"
            onClick={scrollToTop}
            className="fixed bottom-16 right-6 py-3 px-6 rounded-full transition"
          />
        </>
      )}
    </>
  );
}
