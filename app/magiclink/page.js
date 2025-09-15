"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import PageTitleWithImages from "@components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import NounBlackCatIcon from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/NounBlackCatIcon";
import MagicRabbitSVG from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/MagicRabbitSVG";

export default async function LoginScreen() {
  return (
    <section className="h-fit">
      <PageTitleWithImages
        title="Magic"
        title2="Link"
      />
      <div className="px-6 h-full text-gray-100">
        <div className="flex xl:justify-center  justify-center items-center flex-wrap ">
          <div className="mx-auto mb-12 md:mb-0">
            <div className="text-center  mb-4 flex justify-center mt-2">
              <MagicRabbitSVG />
              <h2 className="text-4xl"> Magic link request sent! </h2>
              <NounBlackCatIcon fill="purple" />
            </div>

            <p className="text-center rounded-lg mb-2">
              Congrats! If the email you entered is in our system, you will
              recieve a magic link in your inbox.
            </p>
            <p className="text-center rounded-lg mb-2">
              Click the link in the email to be signed in.
            </p>

            <section className="bg-secondary p-2 ">
              <div className="flex mt-2"></div>

              <p className="text-center rounded-lg ">
                <strong> No email? </strong> Please check for typos and check
                your spam folder.
              </p>
              <p className="text-center rounded-lg ">
                It may take several minutes for the email to arrive.
              </p>
            </section>

            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"></div>

            {/* <!-- Registration Link--> */}

            <p className="text-sm font-semibold mt-2 pt-1 mb-0 text-center">
              <FontAwesomeIcon
                className="fa-bounce text-yellow-300 mr-2 text-xl"
                icon={faPaw}
              />
              Don&apos;t have an account? Welcome! &nbsp;
              <Link
                href={`/register`}
                className="text-yellow-300 hover:text-indigo-200 focus:text-red-700 transition duration-200 ease-in-out"
              >
                Register by clicking here
              </Link>
            </p>

            <p className="text-xs text-center my-4">
              Icons from Noun Project:
              <span>
                <a
                  href="https://thenounproject.com/browse/icons/term/magic/"
                  title="magic Icons"
                >
                  * Magic by Monkik{" "}
                </a>
              </span>
              <span>
                <a
                  href="https://thenounproject.com/browse/icons/term/black-cat/"
                  title="black cat Icons"
                >
                  * Black Cat by Narakorn Chanchittakarm{" "}
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
