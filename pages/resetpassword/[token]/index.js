import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../../../components/NavBar/NavLayoutwithSettingsMenu";
import { getError } from "../../../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import dbConnect from "../../../utils/db";
import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import GeneralButton from "../../../components/ReusableSmallComponents/buttons/GeneralButton";

import Image from "next/image";
import { getCsrfToken } from "next-auth/react";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );
  const csrfToken = await getCsrfToken(context);

  //allows us to grab the dynamic value from the url
  const token = context.params.token;
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
        token,
      },
    };
  }
};

export default function ResetPassword({ token, sessionFromServer, csrfToken }) {
  const { data: session } = useSession();
  //useSession needed in order to grab session after the page is loaded, aka so we can grab session once we login

  const [error, setError] = useState("");
  const [verified, setVerified] = useState("");
  const [user, setUser] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target[0].value;

    //     try {
    //       let res = await fetch("/api/resetpassword", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           password,
    //         }),
    //       });
    //       if (res.status === 400) {
    //         setError("User with this email is not registered");
    //       }
    //       if (res.status === 200) {
    //         setError("");
    //         router.push("/login");
    //       }
    //     } catch (error) {
    //       setError("Error, try again");
    //       console.log(error);
    //     }
    //   };
  };

  return (
    <div>
      <Layout
        title="Reset Password"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <div>
        <section className="h-fit">
          <div className="px-6 h-full text-gray-100">
            <div className="flex justify-center items-center flex-wrap ">
              <div className=" xl:w-4/12 lg:w-4/12 md:w-5/12 mb-12 ">
                <Image
                  src="/lostpasswordsquirrel.jpg"
                  className="w-full rounded-full shadow-lg"
                  width={200}
                  height={200}
                  layout="responsive"
                  alt="A guinea pig looks at the screen calmly as it sits on a keyboard"
                  unoptimized
                />
              </div>

              <div className="ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
                <form
                  className="mx-auto max-w-screen-md"
                  onSubmit={handleSubmit}
                >
                  <div className="text-center text-2xl mb-4">
                    Reset Password{" "}
                  </div>

                  {/* <!-- Email input --> */}
                  <div className="mb-6">
                    <label htmlFor="newpassword">Password</label>
                    <input
                      type="password"
                      disabled={error.length > 0}
                      //this way if the tokens expired ect, they can't enter a password
                      className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                      placeholder="password"
                      required
                    />

                    {error && <div className="text-red-500">{error}</div>}
                  </div>

                  {/* <!-- Login Button --> */}
                  <div className="text-center lg:text-left">
                    <button
                      type="submit"
                      className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Reset Password
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
                  <Link href={`/register`}>
                    <a className="text-yellow-300 hover:text-indigo-200 focus:text-red-700 transition duration-200 ease-in-out">
                      Register by clicking here
                    </a>
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
