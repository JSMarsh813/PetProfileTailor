import React from "react";
import Layout from "@components/NavBar/NavLayoutwithSettingsMenu";

import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

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

  //and provide the data as props to the page by returning an object from the function
};

export default function FetchUsers({ sessionFromServer }) {
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  return (
    <div className=" h-screen">
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <section className="max-w-7xl mx-auto text-white">
        <div>lookup user by: user name</div>

        <div>lookup user by: profilename</div>
      </section>
    </div>
  );
}
