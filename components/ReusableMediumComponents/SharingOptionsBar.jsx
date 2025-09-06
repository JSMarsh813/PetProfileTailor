import React from "react";
import { forwardRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import LinkButton from "../ReusableSmallComponents/buttons/LinkButton";
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
  EmailShareButton,
  EmailIcon,
} from "next-share";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SharingOptionsBar({ linkToShare, localLink }) {
  linkToShare = linkToShare.split(" ").join("%20");

  return (
    <section className="flex sm:flex-row flex-wrap justify-evenly items-center">
      <div className="w-full justify-evenly flex flex-col items-center gap-4 sm:gap-0 sm:flex-row mb-6 sm:mb-4">
        <button
          className="bg-subtleWhite px-4 py-2 
                  rounded-full
                  text-darkPurple
                  font-semibold
                  shadow-md
                  shadow-darkPurple
                  hover:text-violet-200
                  hover:bg-darkPurple inline-block max-w-[160px]"
          onClick={() => {
            navigator.clipboard.writeText(linkToShare);
            toast.success("link saved to clipboard");
          }}
        >
          Copy link
        </button>

        <LinkButton
          text="Go to link"
          href={`${localLink}`}
          className="bg-subtleWhite px-4 py-2
                  rounded-full
                  text-darkPurple
                  font-semibold
                  shadow-md
                  shadow-darkPurple
                  hover:text-violet-200
                  hover:bg-darkPurple max-w-[160px]"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 sm:gap-0 sm:grid-cols-6 justify-items-center items-center w-full">
        {/* #################   EMAIL ################ */}
        <div
          className="drop-shadow-lg hover:bg-subtleWhite hover:rounded-full hover:items-center flex active:bg-violet-700  
      
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

        {/* #################   FACEBOOK  ################ */}
        <div className="drop-shadow-lg hover:bg-subtleWhite hover:rounded-full hover:items-center flex active:bg-violet-700  focus-within:ring-2 focus-within:ring-indigo-200 ring-offset-2 ring-offset-indigo-600 focus-within:bg-indigo-800">
          <FacebookShareButton
            url={linkToShare}
            hashtag={"#tailoredPetNames"}
          >
            <span className="focus:ring focus:ring-violet-300">
              <FacebookIcon
                size={40}
                round
              />
            </span>
          </FacebookShareButton>
        </div>

        {/* #################   TWITTER  ################ */}
        <div className="drop-shadow-lg hover:bg-subtleWhite hover:rounded-full hover:items-center flex active:bg-violet-700  focus-within:ring-2 focus-within:ring-indigo-200 ring-offset-2 ring-offset-indigo-600 focus-within:bg-indigo-800">
          <TwitterShareButton url={linkToShare}>
            <TwitterIcon
              size={40}
              round
            />
          </TwitterShareButton>
        </div>

        <div className="drop-shadow-lg hover:bg-subtleWhite hover:rounded-full hover:items-center flex active:bg-violet-700  focus-within:ring-2 focus-within:ring-indigo-200 ring-offset-2 ring-offset-indigo-600 focus-within:bg-indigo-800">
          <RedditShareButton
            url={linkToShare}
            title={linkToShare}
          >
            <RedditIcon
              size={40}
              round
            />
          </RedditShareButton>
        </div>

        <div className="drop-shadow-lg hover:bg-subtleWhite hover:rounded-full hover:items-center flex active:bg-violet-700  focus-within:ring-2 focus-within:ring-indigo-200 ring-offset-2 ring-offset-indigo-600 focus-within:bg-indigo-800">
          <TumblrShareButton
            url={linkToShare}
            title={linkToShare}
          >
            <TumblrIcon
              size={40}
              round
            />
          </TumblrShareButton>
        </div>

        <div
          className="drop-shadow-lg hover:bg-subtleWhite hover:rounded-full hover:items-center flex active:bg-violet-700     
        ring-offset-2 ring-offset-indigo-600   
      focus-within:ring-2 focus-within:ring-indigo-200  focus-within:bg-indigo-800"
        >
          <WhatsappShareButton
            url={linkToShare}
            title={linkToShare}
            separator=":: "
          >
            <WhatsappIcon
              size={40}
              round
            />
          </WhatsappShareButton>
        </div>
      </div>
    </section>
  );
}

export default SharingOptionsBar;
