import React from "react";
import { forwardRef } from "react";
import NavBar from "../components/NavBar/NavLayoutwithSettingsMenu";
import dbConnect from "../utils/db";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "next-auth/react";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import ListWithPawPrintIcon from "../components/ReusableSmallComponents/ListWithPawPrintIcon";
import Router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faTwitter } from "@fortawesome/free-solid-svg-icons";

export const getInitialProps = async () => {
  await dbConnect.connect();
  const session = await getSession();

  return {
    props: {
      sessionFromServer: session,
    },
  };
};

const MyLink = forwardRef((props, ref) => {
  let { href, active, children, ...rest } = props;
  return (
    <Link href={href}>
      <a
        ref={ref}
        {...rest}
      >
        {children}
      </a>
    </Link>
  );
});
MyLink.displayName = "MyLink";

export default function Custom404({ sessionFromServer }) {
  //grab data from Session and rename data to session

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
        title="Login"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <PageTitleWithImages
        title="500"
        title2="Server Error"
      />
      <p className="text-center text-white">
        Ruh-roh! Our server had an error.
      </p>

      <div className="w-60 mx-auto my-4 ">
        <Image
          className="mb-4 rounded-full"
          src="/404.gif"
          width={90}
          height={90}
          layout="responsive"
          alt="gif of a dog and their owner which is hiding behind a blanket, the blanket falls and the owner is not there. The dog looks very confused"
        />
      </div>

      <ul className="text-center text-white bg-darkPurple max-w-4xl mx-auto h-fit pt-4 sm:px-2">
        <ListWithPawPrintIcon text=" You can try to reload the page to see if the error resolves" />

        <li>
          <FontAwesomeIcon
            icon={faEnvelope}
            className="mr-2"
          />
          <button
            type="button"
            onClick={() => Router.push("mailto:petprofiletailor@gmail.com")}
          >
            Email Us
          </button>
        </li>

        <li>
          <FontAwesomeIcon
            icon={faTwitter}
            className="mr-2"
          />
          <button
            type="button"
            onClick={() => Router.push("mailto:petprofiletailor@gmail.com")}
          >
            Send Me a Message On Twitter
          </button>
        </li>
        <ListWithPawPrintIcon
          className="mb-6"
          text="You may want to return to our login page"
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
