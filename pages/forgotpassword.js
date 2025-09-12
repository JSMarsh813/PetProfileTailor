import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "@components/NavBar/NavLayoutwithSettingsMenu";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import dbConnect from "@utils/db";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";

import Image from "next/image";
import { getCsrfToken } from "next-auth/react";
import NounBlackCatIcon from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/NounBlackCatIcon";
import MagicRabbitSVG from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/MagicRabbitSVG";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );
  const csrfToken = await getCsrfToken(context);

  await dbConnect.connect();

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  } else {
    return {
      props: {
        sessionFromServer: session,
        csrfToken,
      },
    };
  }
};

export default function ForgotPassword({ sessionFromServer, csrfToken }) {
  const { data: session } = useSession();
  //useSession needed in order to grab session after the page is loaded, aka so we can grab session once we login

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const { redirect } = router.query;

  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [router, session, redirect]);
  //if the session exists, then the user is already signed in. So if this is true, push back to the homepage
  //we need to use router (line 8) to redirect user

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;

    if (!isValidEmail(email)) {
      setMessage("Email is invalid");
      return;
    }

    try {
      let res = await fetch("/api/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      //for safety, we won't give any hints if this email exists in the database or not
      if (res.status === 404 || res.status == 200) {
        setMessage(
          "If an account is registered to this email, a reset password link will be sent to this email",
        );
        setError(false);
      } else {
        setError(true);
        setMessage(
          "Error reaching api path for forgot password, refresh page and try again",
        );
      }
    } catch (message) {
      setMessage(
        "Error reaching api path for forgot password, refresh page and try again",
      );
      setError(true);
      console.log(message);
    }
  };

  return (
    <div>
      <Layout
        title="Forgot Password"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <div className="max-w-7xl mx-auto">
        <section className="h-fit">
          <div className="px-6 h-full text-gray-100">
            <div className="flex justify-center items-center flex-wrap ">
              <div className=" xl:w-3/12 lg:w-3/12 w-4/12 lg:my-12  mr-10">
                <Image
                  src="/lostpasswordsquirrel.jpg"
                  className="w-full rounded-full shadow-lg"
                  width={200}
                  height={200}
                  alt="A squirrel with a poofy tail looking suprised"
                  unoptimized
                  sizes="100vw"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>

              <div className="xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0 mt-2">
                <form
                  className="mx-auto max-w-screen-md"
                  onSubmit={handleSubmit}
                >
                  <div className="text-center text-2xl mb-4">
                    Forgot Password{" "}
                  </div>

                  <p className="pb-4">
                    Aww nuts! Forgot your password? Don&apos;t worry you can
                    reset it here.
                  </p>

                  {/* <!-- Email input --> */}
                  <div className="mb-6">
                    <label htmlFor="signinemail">Email</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                      placeholder="Email"
                      required
                    />

                    {message && (
                      <div
                        className={`text-black ${
                          error ? "bg-red-300" : "bg-green-300"
                        } rounded-lg p-2 border-4 ${
                          error ? "border-red-700" : "border-green-700"
                        }`}
                        role="alert"
                      >
                        {message}
                      </div>
                    )}
                  </div>

                  {/* <!-- Login Button --> */}
                  <div className="text-center lg:text-left">
                    <button
                      type="submit"
                      className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Submit
                    </button>
                  </div>
                </form>

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
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
