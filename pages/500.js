import React from "react";
import { forwardRef } from "react";
import NavBar from "../components/NavBar/NavLayoutwithSettingsMenu";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import ListWithPawPrintIcon from "../components/ReusableSmallComponents/ListWithPawPrintIcon";
import Router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMessage } from "@fortawesome/free-solid-svg-icons";
import PawPrintIcon from "../components/ReusableSmallComponents/iconsOrSvgImages/PawPrintIcon";
import GifHover from "../components/ReusableSmallComponents/GifHover";

const MyLink = forwardRef((props, ref) => {
  let { href, active, children, ...rest } = props;
  return (
    (<Link href={href} ref={ref} {...rest}>

      {children}

    </Link>)
  );
});
MyLink.displayName = "MyLink";

export default function Custom404() {
  //grab data from Session and rename data to session
  const { data: sessionFromServer, status } = useSession();

  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  return (
    <>
      <NavBar
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <PageTitleWithImages
        title="500"
        title2="Server Error"
      />
      <p className="text-center text-white">
        Ruh-roh! Unfortunately our server got distracted hunting a
        &quot;mouse&quot; 😿.
      </p>

      <GifHover
        divStyling="w-60 mx-auto my-4"
        className="mb-4 rounded-full"
        layout="responsive"
        gifSrc="/server.gif"
        stillImageSrc="/server.png"
        alt="a man has his hand on a computer mouse, his pet weasel then jumps over and begins to wrestle his hand"
        width={300}
        height={300}
      />

      <ul className="text-center text-white bg-darkPurple max-w-4xl mx-auto h-fit pt-4 sm:px-2">
        <ListWithPawPrintIcon text=" You can try to reload the page to see if the error resolves" />

        <li>
          <h4>
            <PawPrintIcon /> Or contact me directly:
          </h4>

          <span className="block">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="mr-2"
            />
            <button
              type="button"
              onClick={() => Router.push("mailto:petprofiletailor@gmail.com")}
            >
              Email
            </button>
          </span>

          <span className="block">
            <a href="https://twitter.com/Janetthedev">
              <FontAwesomeIcon
                icon={faMessage}
                className="mr-2"
              />
              Twitter
            </a>
          </span>
        </li>

        <ListWithPawPrintIcon
          className="mb-6"
          text="Or return to our login page"
        />
        <li className="h-16">
          <MyLink
            className="bg-yellow-300 text-violet-800  font-bold py-3 px-4 border-b-4 border-yellow-100    
          shadow-lg shadow-stone-900/70
          hover:bg-blue-400                            hover:text-white                            hover:border-blue-500 rounded text-base 
          "
            href={`/login`}
          >
            Login
          </MyLink>
        </li>
      </ul>
    </>
  );
}
