import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import axios from "axios";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import ImageUpload from "../components/AddingNewData/ImageUpload";

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

export default function ProfileScreen({ sessionFromServer }) {
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
    setValue("name", sessionFromServer.user.name);
    setValue("email", sessionFromServer.user.email);
  }, [sessionFromServer.user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      toast.success("Profile updated successfully");
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div className="w-full">
      <Layout
        title="Profile"
        profileImage={profileImage}
        userName={userName}
      />

      <div className="h-40 w-40 mx-auto mb-4">
        <Image
          className="rounded-full"
          src="/sunglasseseditsettingsdog.jpg"
          layout="responsive"
          width={160}
          height={160}
          objectFit="cover"
          alt="Image of a small dog looking relaxed and wearing sunglasses"
        />
      </div>

      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl text-center border-y-2 py-2 bg-violet-700 font-semibold text-white">
          Update Profile
        </h1>

        <p className="text-white text-center pb-2">
          You can change your name, email and/or password
        </p>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="text-white"
          >
            Name
          </label>
          <input
            type="text"
            maxLength="30"
            className="w-full text-darkPurple"
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter name",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="text-white"
          >
            Email
          </label>
          <input
            type="email"
            className="w-full text-darkPurple"
            id="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="text-white"
          >
            New Password
          </label>

          <input
            className="w-full text-darkPurple"
            type="password"
            id="password"
            {...register("password", {
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
          />
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>

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
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>
        <div className="mb-4">
          <GeneralButton text="Update Profile" />
        </div>
      </form>

      <ImageUpload sessionFromServer={sessionFromServer} />
    </div>
  );
}

ProfileScreen.auth = true;
