import Link from "next/Link";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";

import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentDots,
  faImage,
  faShareFromSquare,
  faFaceGrinWink,
  faUserTie,
  faCircleChevronDown,
  faTrashCan,
  faX,
  faCircleXmark,
  faTowerBroadcast,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
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
      "http://localhost:3000/api/user/getASpecificUserByProfileName/" +
        nameCheck
    );
    let nameData = await nameResponse.json();
    console.log(nameData);
    setNamesThatExist(nameData);
    setNameCheckFunctionRun(true);
    console.log(`this is names that exist ${JSON.stringify(namesThatExist)}`);
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
  } = useForm();

  const submitHandler = async ({ name, email, password, profilename }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        profilename,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Successfully signed up! Sending to profile page");

        router.push("/");
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <div className="bg-violet-900 h-fit text-white">
      <Layout
        title="Create Account"
        profileImage={profileImage}
        userName={userName}
      />

      <img
        className="mx-auto h-60"
        src="https://media.tenor.com/IJBRrnPWOqoAAAAd/welcome-high-five.gif"
      />

      <section className="text-center mt-2">
        <h4 className="font-semibold text-lg">
          {" "}
          Check if a profile name is available{" "}
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
            {" "}
            Search{" "}
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
            {" "}
            UserName (this can be changed later, 30 characters max)
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
        </div>

        <div className="mb-4">
          <label htmlFor="name">
            {" "}
            Profile Name (this CAN'T be changed later,30 characters max)
          </label>
          <input
            type="text"
            className="w-full text-darkPurple"
            maxLength="30"
            id="name"
            autoFocus
            {...register("profilename", {
              required: "Please enter a profilename",
            })}
          />

          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 6, message: "password is more than 5 chars" },
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
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full text-darkPurple"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please enter confirm password",
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
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>

        <GeneralButton text="register" />
      </form>
    </div>
  );
}
