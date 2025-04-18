import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import Image from "next/image";

import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  return {
    props: {
      sessionFromServer: session,
    },
  };
};

export default function Register({ sessionFromServer }) {
  const [namesThatExist, setNamesThatExist] = useState([]);
  const [nameCheck, setNameCheck] = useState("");
  const [nameCheckFunctionRun, setNameCheckFunctionRun] = useState(false);

  //for Nav menu profile name and image
  //let section exists in case the user is not signed in
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [router, session, redirect]);

  async function checkIfNameExists() {
    let nameResponse = await fetch(
      "/api/user/getASpecificUserByProfileName/" + nameCheck,
    );
    let nameData = await nameResponse.json();

    setNamesThatExist(nameData);
    setNameCheckFunctionRun(true);
  }

  function resetData(e) {
    setNameCheck(e.target.value.toLowerCase());
    setNameCheckFunctionRun(false);
    setNamesThatExist(null);
  }

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
    watch,
  } = useForm();

  const submitHandler = async ({ name, email, password, profilename }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        profilename: profilename.toLowerCase(),
      });

      if (password === "") {
        const magicLinkSignUp = await signIn("email", {
          redirect: false,
          email,
        });

        if (magicLinkSignUp.error) {
          toast.error(magicLinkSignUp.error);
          console.log(JSON.stringify(magicLinkSignUp));
        } else {
          toast.success(
            "Successfully signed up! A magic link has been sent to your email",
          );

          router.push("/magiclink");
        }
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
        console.log(JSON.stringify(result));
      } else {
        toast.success("Successfully signed up! Sending to dashboard");

        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const passwordEntered = watch("password");

  return (
    <div className="bg-violet-900 h-fit text-white">
      <Layout
        title="Create Account"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <h1 className="flex justify-center text-3xl mb-1"> Register </h1>
      <div className="flex justify-center">
        <Image
          src="/welcometothepack.webp"
          alt=""
          width={220}
          height={220}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
      <section className="text-center mt-2">
        <h4 className="font-semibold text-lg">
          Check if a profile name is available
        </h4>

        <input
          type="text"
          className="text-darkPurple"
          value={nameCheck}
          maxLength="30"
          onChange={(e) => resetData(e)}
        />

        <button
          className="inline-block bg-darkPurple p-2 border-2 border-yellow-200"
          onClick={() => checkIfNameExists()}
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="text-2xl"
            color="yellow"
          />

          <span
            className="mx-2
                                   text-yellow-200"
          >
            Search
          </span>
        </button>
        <span className="block">
          {`${30 - nameCheck.length}/30 characters left`}{" "}
        </span>

        {nameCheckFunctionRun && namesThatExist.length != 0 && (
          <p
            className="mt-2 
                                        text-yellow-200 font-bold
                                         bg-red-700
                                         border-2 border-yellow-200"
          >
            {namesThatExist[0].name} already exists!
          </p>
        )}

        {nameCheckFunctionRun && !namesThatExist.length && (
          <span className="block">
            Success! {nameCheck} does NOT exist yet.
          </span>
        )}
      </section>
      {/* #################### FORM #########################*/}
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="my-4 text-2xl text-center">Create Account</h1>

        <div className="mb-4">
          <label htmlFor="name">
            User Name (this <strong> can </strong> be changed later, 30
            characters max)
          </label>

          <input
            type="text"
            className="w-full text-darkPurple"
            maxLength="30"
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter a name",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
          <span> Valid Characters: any </span>
        </div>

        <div className="mb-4">
          <label htmlFor="profilename">
            Profile Name (this <strong>CAN&apos;T</strong> be changed later, it
            will be unique to you, 30 characters max)
          </label>

          <input
            type="text"
            className="w-full text-darkPurple lowercase"
            maxLength="30"
            id="profilename"
            autoFocus
            {...register("profilename", {
              required: "Please enter a profilename",
              validate: (value) =>
                value.match(/[^a-z\d&'-]+/) == null ||
                `invalid characters entered ${value.match(/[^a-z\d&'-]+/g)}`,
            })}
          />

          <span> Valid Characters: a-z, numbers, &, &apos; and - </span>

          {errors.profilename && (
            <div className="text-red-500">{errors.profilename.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter an email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter a valid email",
              },
            })}
            className="w-full text-darkPurple"
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password">
            Password (recommended but not required for magic link users)
          </label>
          <input
            type="password"
            {...register("password", {
              minLength: {
                value: 6,
                message: "password must be more than 5 chars",
              },
            })}
            className="w-full text-darkPurple"
            id="password"
            autoFocus
          ></input>

          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <span> {console.log(passwordEntered != "")}</span>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full text-darkPurple"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: passwordEntered && "this field is required",
              // if the password field has input in it (its truthy), the confirm password field is required. Because it defaults to true. And the second statement shows

              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
              minLength: {
                value: 6,
                message: "Confirm password must be more than 5 chars",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        <section className="bg-darkPurple p-2 mb-2 ">
          <h3 className="mb-4 border-b-2 border-white pb-2 font-bold">
            Notes for magic link users (logging in with an email link, not a
            password)
          </h3>
          <p className="mb-4">
            We <strong> recommend </strong>magic link users also add a password.
            This way you will not be locked out of your account if you lose
            access to your email. However, we do not require this.
          </p>

          <p className="mb-4">
            To access their new account,{" "}
            <strong>
              magic link users will have to click the link sent to their email.
            </strong>{" "}
            This is done to ensure there were no typos in the email.
          </p>

          <p className="mb-4">
            If you decide you want to add a password later,
            <strong> you can add a password in settings </strong>
          </p>
        </section>

        <GeneralButton text="register" />
      </form>
    </div>
  );
}
