"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { getError } from "@utils/error";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";

import Image from "next/image";
import NounBlackCatIcon from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/NounBlackCatIcon";
import MagicRabbitSVG from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/MagicRabbitSVG";
import RegisterInput from "@components/FormComponents/RegisterInput";
import StyledInput from "@components/FormComponents/StyledInput";
import LinkButton from "@components/ReusableSmallComponents/buttons/LinkButton";
import { useRouter } from "next/navigation";
import { getCsrfToken } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();
  const [csrfToken, setCsrfToken] = useState("");
  const [redirect, setRedirect] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    getCsrfToken().then((token) => {
      if (isMounted) setCsrfToken(token ?? "");
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!redirect) return;
    if (session) {
      // Use a microtask Promise.resolve() to avoid interfering with render
      Promise.resolve().then(() => router.replace("/dashboard"));
    }
    //Wrapping in Promise.resolve() defers the push until after the current render, preventing multiple “history” calls.
  }, [redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
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
      setRedirect(true);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <section className="h-fit max-w-7xl mx-auto ">
      <div className="px-6 h-full text-gray-100">
        <div className="flex lg:justify-between xl:justify-center  justify-center items-center flex-wrap h- g-6">
          <div className="grow-0 shrink-1 md:shrink-0 basis-auto lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
            <Image
              src="https://cdn.pixabay.com/photo/2020/03/31/16/17/animal-4988403_960_720.jpg"
              className="max-w-[300px] lg:max-w-lg rounded-full shadow-lg border-2 border-yellow-300 border-dashed mx-auto"
              width={200}
              height={200}
              alt="A guinea pig looks at the screen calmly as it sits on a keyboard"
              unoptimized
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>

          {/* ################ Right Side Section with login #################### */}
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0 md:mt-3 lg:mt-0">
            <form
              className="mx-auto max-w-screen-md border-x  border-subtleWhite"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div className="flex justify-center text-2xl my-4 "> Login </div>

              {/* <!-- Email input --> */}

              <RegisterInput
                id="signinemail"
                label="Email"
                type="email"
                autoFocus
                labelStyling="text-center"
                inputStyling="flex mx-auto "
                register={register}
                validation={{
                  required: "Please enter email",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                    message: "Please enter valid email",
                  },
                }}
                error={errors.email}
              />

              <RegisterInput
                id="password"
                label="Password"
                type="password"
                labelStyling="text-center"
                inputStyling="flex mx-auto "
                register={register}
                validation={{
                  required: "Please enter password",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                error={errors.password}
              />

              {/* ############# Forgot Password ################### */}

              <div className="flex justify-center mb-2">
                <span> Forgot? </span>

                <LinkButton
                  text="Click here"
                  href="/forgotpassword"
                  className="underline-offset-4 underline hover:border-b-2 hover:text-slate-300 hover:border-text-slate-300 ml-2"
                />
              </div>

              <div className="text-center">
                <GeneralButton
                  text="sign in"
                  className=""
                  type="submit"
                  subtle
                />
              </div>
            </form>

            {/* ################ Or Divider ##################### */}

            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <p className="text-center font-semibold mx-4 mb-0">Or</p>
            </div>

            {/* ################ Magic Link ##################### */}

            <section className="bg-secondary p-2 ">
              <h4 className="text-center mb-2 pb-2 font-semibold border-b-2 border-white">
                Login with a magic link (for current users)
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
                <StyledInput
                  type="email"
                  id="magiclinkemail"
                  name="email"
                  className="lg:min-w-64"
                />

                <GeneralButton
                  text="sign in"
                  className="ml-2 mb-2 text-center"
                  type="submit"
                  subtle
                />
              </form>

              <div className="flex mt-2">
                <MagicRabbitSVG />
                <p className="text-center rounded-lg">
                  Sign in without a password! We&apos;ll send a magic link to
                  this email, so you can click the link to sign in.
                </p>

                <NounBlackCatIcon fill="purple" />
              </div>

              <p className="text-center rounded-lg">
                <strong> No email? </strong> Please check for typos and check
                your spam folder.
              </p>
            </section>

            {/* ################ Divider ##################### */}

            {/* <!-- Registration Link--> */}

            <section className=" border-x border-subtleWhite my-4">
              <p className="font-semibold mt-2 pt-1 mb-0 text-center">
                <FontAwesomeIcon
                  className="fa-bounce text-yellow-300 mr-2 text-xl "
                  icon={faPaw}
                />
                Don&apos;t have an account? Welcome! &nbsp;
                <LinkButton
                  href={`/register`}
                  defaultStyle
                  text="Register"
                />
              </p>
              <section className="flex flex-col text-center">
                <small className="mt-4">Icons from Noun Project:</small>
                <small>
                  <a
                    href="https://thenounproject.com/browse/icons/term/magic/"
                    title="magic Icons"
                  >
                    Magic by Monkik{" "}
                  </a>
                </small>
                <small>
                  <a
                    href="https://thenounproject.com/browse/icons/term/black-cat/"
                    title="black cat Icons"
                  >
                    Black Cat by Narakorn Chanchittakarm{" "}
                  </a>
                </small>
              </section>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
