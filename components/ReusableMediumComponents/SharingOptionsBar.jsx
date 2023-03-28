import React from "react";
import { forwardRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import {
  FacebookShareButton,
  FacebookIcon,
  RedditShareButton,
  RedditIcon,
  TumblrShareButton,
  TumblrIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  EmailShareButton,
  EmailIcon,
} from "next-share";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const MyLink = forwardRef((props, ref) => {
  let { href, active, children, ...rest } = props;
  return (
    <Link href={href}>
      <a
        ref={ref}
        className={`block rounded-md px-2 py-2 text-md
        hover:bg-yellow-400
        hover:text-violet-900  
        text-center                   
    ${active ? "bg-yellow-400 text-violet-900" : "bg-violet-800"}
`}
        {...rest}
      >
        {children}
      </a>
    </Link>
  );
});
MyLink.displayName = "MyLink";

function SharingOptionsBar({ linkToShare, localLink }) {
  return (
    <section className="flex justify-evenly ">
      <button
        className="bg-amber-300 px-4 py-2
                  rounded-full
                  text-violet-800
                  font-semibold
                  shadow-md
                  shadow-darkPurple
                  hover:text-violet-200
                  hover:bg-darkPurple"
        onClick={() => {
          navigator.clipboard.writeText(linkToShare);
          toast.success("link saved to clipboard");
        }}
      >
        <FontAwesomeIcon
          icon={faLink}
          className="mr-2"
        />
        Copy link
      </button>

      <MyLink
        className="bg-amber-300 px-4 py-2
        rounded-full
        text-violet-800
        font-semibold
        shadow-md
        shadow-darkPurple
        hover:text-violet-200
        hover:bg-darkPurple"
        href={localLink}
      >
        <FontAwesomeIcon
          icon={faPersonRunning}
          className="mr-2"
        />
        Go To Link
      </MyLink>

      <div
        className="drop-shadow-lg hover:bg-yellow-300 hover:rounded-full hover:items-center flex active:bg-violet-700  
      
      ring-offset-2 ring-offset-indigo-600 
      
      focus-within:ring-2 focus-within:ring-indigo-200 focus-within:bg-indigo-800"
      >
        <EmailShareButton
          url={linkToShare}
          subject={"Link from Pet Profile Tailor"}
        >
          <EmailIcon
            size={40}
            round
          />
        </EmailShareButton>
      </div>

      <div className="drop-shadow-lg hover:bg-yellow-300 hover:rounded-full hover:items-center flex active:bg-violet-700  focus-within:ring-2 focus-within:ring-indigo-200 ring-offset-2 ring-offset-indigo-600 focus-within:bg-indigo-800">
        <FacebookShareButton
          url={linkToShare}
          hashtag={"#PetProfileTailor"}
        >
          <span className="focus:ring focus:ring-violet-300">
            <FacebookIcon
              size={40}
              round
            />
          </span>
        </FacebookShareButton>
      </div>

      <div className="drop-shadow-lg hover:bg-yellow-300 hover:rounded-full hover:items-center flex active:bg-violet-700  focus-within:ring-2 focus-within:ring-indigo-200 ring-offset-2 ring-offset-indigo-600 focus-within:bg-indigo-800">
        <TwitterShareButton url={linkToShare}>
          <TwitterIcon
            size={40}
            round
          />
        </TwitterShareButton>
      </div>

      <div className="drop-shadow-lg hover:bg-yellow-300 hover:rounded-full hover:items-center flex active:bg-violet-700  focus-within:ring-2 focus-within:ring-indigo-200 ring-offset-2 ring-offset-indigo-600 focus-within:bg-indigo-800">
        <RedditShareButton url={linkToShare}>
          <RedditIcon
            size={40}
            round
          />
        </RedditShareButton>
      </div>

      <div className="drop-shadow-lg hover:bg-yellow-300 hover:rounded-full hover:items-center flex active:bg-violet-700  focus-within:ring-2 focus-within:ring-indigo-200 ring-offset-2 ring-offset-indigo-600 focus-within:bg-indigo-800">
        <TumblrShareButton url={linkToShare}>
          <TumblrIcon
            size={40}
            round
          />
        </TumblrShareButton>
      </div>

      <div
        className="drop-shadow-lg hover:bg-yellow-300 hover:rounded-full hover:items-center flex active:bg-violet-700     
        ring-offset-2 ring-offset-indigo-600   
      focus-within:ring-2 focus-within:ring-indigo-200  focus-within:bg-indigo-800"
      >
        <WhatsappShareButton
          url={linkToShare}
          separator=":: "
        >
          <WhatsappIcon
            size={40}
            round
          />
        </WhatsappShareButton>
      </div>
    </section>
  );
}

export default SharingOptionsBar;
