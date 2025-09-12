import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "@utils/error";
import axios from "axios";
import Layout from "@components/NavBar/NavLayoutwithSettingsMenu";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import ImageUpload from "@components/AddingNewData/ImageUpload";
import StyledInput from "@components/FormComponents/StyledInput";
import RegisterInput from "@components/FormComponents/RegisterInput";

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
    setValue("userid", sessionFromServer.user.id);
  }, [sessionFromServer.user, setValue]);

  const submitHandler = async ({ name, email, password, userid }) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
        userid,
      });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Layout
        title="Profile"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <div className="h-fit w-40 mx-auto mb-4 ">
        <Image
          className="rounded-full"
          src="/sunglasseseditsettingsdog.jpg"
          width={160}
          height={160}
          alt="Image of a small dog looking relaxed and wearing sunglasses"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </div>
      <div className=" mx-auto  text-center max-w-3xl">
        <form onSubmit={handleSubmit(submitHandler)}>
          <h1 className="mb-4 text-xl text-center border-y-2 py-2 bg-violet-700 font-semibold text-white   mx-auto">
            Update Profile
          </h1>

          <p className="text-white text-center pb-2">
            You can change your name, email and/or password
          </p>
          <RegisterInput
            id="name"
            label="Name"
            maxLength={30}
            autoFocus
            register={register}
            validation={{ required: "Please enter a name" }}
            error={errors.name}
          />

          <RegisterInput
            id="email"
            label="Email"
            type="email"
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
            label="New Password"
            type="password"
            register={register}
            validation={{
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            error={errors.password}
          />

          <RegisterInput
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            register={register}
            validation={{
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
              minLength: {
                value: 6,
                message: "Confirm password must be at least 6 characters",
              },
            }}
            error={errors.confirmPassword}
          />

          <div className="mb-4 w-full text-center">
            <GeneralButton text="Update Profile" />
          </div>
        </form>
        <ImageUpload sessionFromServer={sessionFromServer} />
      </div>
    </div>
  );
}

ProfileScreen.auth = true;
