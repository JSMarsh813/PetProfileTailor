import React, { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";

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

export default function NavLayoutwithSettingsMenu({
  category,
  nameList,
  sessionFromServer,
  pageProps,
}) {
  //for Nav menu profile name and image
  //let section exists in case the user is not signed in
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  return (
    <Layout profileImage={profileImage} userName={userName}>
      <p> {userName} lets test this again</p>
    </Layout>
  );
}
