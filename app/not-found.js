"use client";

import PageTitleWithImages from "@components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import ListWithPawPrintIcon from "@components/ReusableSmallComponents/ListWithPawPrintIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMessage } from "@fortawesome/free-solid-svg-icons";
import PawPrintIcon from "@components/ReusableSmallComponents/iconsOrSvgImages/PawPrintIcon";
import GifHover from "@components/ReusableSmallComponents/GifHover";
import Link from "next/link";

export default function Custom404() {
  //grab data from Session and rename data to session

  return (
    <>
      <PageTitleWithImages
        title="404"
        title2="Page Not Found"
      />
      <p className="text-center text-white">
        Ruh-roh! We can&apos;t seem to find that page 😿. It may have expired or
        been removed.
      </p>

      <GifHover
        divStyling="w-60 mx-auto my-4"
        className="mb-4 rounded-full"
        layout="responsive"
        gifSrc="/404.gif"
        stillImageSrc="/404.png"
        alt="gif of a dog and their owner which is hiding behind a blanket, the blanket falls and the owner is not there. The dog looks very confused"
        width={90}
        height={90}
      />

      <ul className="text-center text-white bg-secondary max-w-4xl mx-auto h-fit pt-4 sm:px-2">
        <ListWithPawPrintIcon
          className="justify-center"
          text=" You can try to reload the page to see if the error resolves"
        />

        <li>
          <h4>
            <PawPrintIcon /> Or contact me directly:
          </h4>

          <span className="block">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="mr-2"
            />
            <a
              href="mailto:petprofiletailor@gmail.com"
              className="underline"
            >
              Email
            </a>
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
          className="mb-6 justify-center"
          text="Or return to the login or dashboard page"
        />
        <li className="h-16">
          <Link
            href="/login"
            className=" bg-yellow-300 text-secondary font-bold py-3 px-4 border-b-4 border-yellow-100    
          shadow-lg shadow-stone-900/70 rounded-2xl
          hover:bg-blue-500                            hover:text-white                            hover:border-blue-700 text-base 
          "
          >
            Login/dashboard
          </Link>
        </li>
      </ul>
    </>
  );
}
