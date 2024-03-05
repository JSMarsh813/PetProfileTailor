import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import dbConnect from "../utils/db";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";

import Image from "next/image";
import { getCsrfToken } from "next-auth/react";
import NounBlackCatIcon from "../components/ReusableSmallComponents/iconsOrSvgImages/svgImages/NounBlackCatIcon";
import MagicRabbitSVG from "../components/ReusableSmallComponents/iconsOrSvgImages/svgImages/MagicRabbitSVG";

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

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      //import signIn on line 3 from nextAuth, which will be handled in the nextauth.js handler
      const result = await signIn("credentials", {
        redirect: false,
        //gets rid of callback url @10:20 https://www.youtube.com/watch?v=EFucgPdjeNg&t=594s&ab_channel=FullStackNiraj
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Successfully signed in! Sending to dashboard");
      }
    } catch (err) {
      toast.error(getError(err));
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
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div className="text-center text-2xl mb-4">
                    {" "}
                    Forgot Password{" "}
                  </div>

                  {/* <!-- Email input --> */}
                  <div className="mb-6">
                    <label htmlFor="signinemail">Email</label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Please enter email",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                          message: "Please enter valid email",
                        },
                      })}
                      className="w-full text-darkPurple"
                      id="signinemail"
                      autoFocus
                    ></input>

                    {errors.email && (
                      <div className="text-red-500">{errors.email.message}</div>
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

                <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                  <p className="text-center font-semibold mx-4 mb-0">Or</p>
                </div>

                <section className="bg-darkPurple p-2 ">
                  <h4 className="text-center mb-2 pb-2 font-semibold border-b-2 border-white">
                    Sign in with a magic Link
                  </h4>

                  <form
                    method="post"
                    action="/api/auth/signin/email"
                    className="text-center"
                  >
                    <input
                      name="csrfToken"
                      type="hidden"
                      defaultValue={csrfToken}
                    />

                    <input
                      type="email"
                      id="magiclinkemail"
                      name="email"
                      className="w-2/3 text-darkPurple "
                    />

                    <GeneralButton
                      text="sign in"
                      className="ml-2 mb-2 text-center"
                      type="submit"
                    />
                  </form>

                  <div className="flex mt-2">
                    <MagicRabbitSVG />
                    <p className="text-center rounded-lg">
                      We&apos;ll email you a magic link so you can sign in
                      without a password.
                    </p>

                    <NounBlackCatIcon fill="purple" />
                  </div>
                </section>

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

                <p className="text-xs text-center mt-4">
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
      </div>
    </div>
  );
}