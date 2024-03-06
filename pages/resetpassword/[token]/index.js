import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import axios from "axios";
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

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [verifiedapiran, setVerifiedapiran] = useState("");
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [userid, setId] = useState(null);

  const router = useRouter();
  const { redirect } = router.query;

  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        let res = await fetch("/api/verifyresetpasstoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });
        console.log(res);
        if (res.status === 404) {
          setMessage("Invalid reset token or token has expired");
          setError(true);
          setVerifiedapiran(true);
        }
        if (res.status === 200) {
          setMessage("");
          setVerifiedapiran(true);
          setError(false);
          const userData = await res.json();
          setUser(userData);
          setName(userData.name);
          setEmail(userData.email);
          setId(userData._id);
        }
      } catch (error) {
        setMessage("Error, try again");
        setError(true);
        console.log(error);
      }
    };
    verifyToken();
  }, [token]);

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [router, session, redirect]);
  //if the session exists, then the user is already signed in. So if this is true, push back to the homepage
  //we need to use router (line 8) to redirect user

  const submitHandler = async ({ password }) => {
    try {
      console.log(password);
      let res = await axios.put("/api/auth/update", {
        name,
        email,
        password,
        userid,
      });
      if (res.status === 422) {
        setMessage(
          "There was an error with validating the name, email or userid of this account",
        );
        setError(true);
      }
      if (res.status === 400) {
        setMessage(
          "There was an unexpected error in the request method of the update API route for the reset password page",
        );
        setError(true);
      }
      if (res.status === 200) {
        setMessage("Password updated successfully");
        setError(false);
        router.push("/login");
      }
    } catch (error) {
      setMessage(
        "There was an error with api route `auth update` for resetting your password, try again. If error persists contact us and send this error message",
      );
      setError(true);
      console.log(error);
    }
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
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div className="text-center text-2xl mb-4">
                    Reset Password{" "}
                  </div>

                  {/* <!-- Email input --> */}
                  <div className="mb-6">
                    <label htmlFor="newpassword">Password</label>
                    <input
                      type="password"
                      disabled={error}
                      //this way if the tokens expired ect, they can't enter a password
                      className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black disabled:bg-red-900 disabled:placeholder-white"
                      placeholder="password"
                      required
                      id="password"
                      {...register("password", {
                        minLength: {
                          value: 6,
                          message: "password is more than 5 chars",
                        },
                      })}
                    />

                    <div className="mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="text-white"
                      >
                        Confirm New Password
                      </label>
                      <input
                        className="w-full text-darkPurple"
                        type="password"
                        id="confirmPassword"
                        {...register("confirmPassword", {
                          validate: (value) => value === getValues("password"),
                          minLength: {
                            value: 6,
                            message: "confirm password is more than 5 chars",
                          },
                        })}
                      />
                      {errors.confirmPassword && (
                        <div className="text-red-500 ">
                          {errors.confirmPassword.message}
                        </div>
                      )}
                      {errors.confirmPassword &&
                        errors.confirmPassword.type === "validate" && (
                          <div className="text-red-500 ">
                            Password do not match
                          </div>
                        )}
                    </div>

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
