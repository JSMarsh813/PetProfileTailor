import React from "react";

import NavBar from "../components/NavBar/NavLayoutwithSettingsMenu";
import dbConnect from "../utils/db";
import Image from "next/image";
import { getSession } from "next-auth/react";

export const getInitialProps = async () => {
  await dbConnect.connect();
  const session = await getSession();

  return {
    props: {
      sessionFromServer: session,
    },
  };
};

export default function Custom404({ sessionFromServer }) {
  //grab data from Session and rename data to session

  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  return (
    <>
      <NavBar
        title="Login"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <h1>404 - Page Not Found test</h1>

      <div className="w-72 md:w-96 mx-auto">
        <Image
          className="mb-4"
          src="/404.gif"
          width={90}
          height={90}
          layout="responsive"
          alt="Poster of an old large dog sitting patiently which says: I like to sleep through the night. I'll bet you do, too. Because I'm a grown-ass adult. Get a dog who gets you. Adopt adult. APA adoption center"
        />
      </div>
    </>
  );
}
